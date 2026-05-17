"""
Database Service for storing analysis history
Uses JSON file storage (can be upgraded to PostgreSQL/MongoDB later)
"""
import json
import os
from typing import List, Dict, Any, Optional
from datetime import datetime
from pathlib import Path
import uuid


class DatabaseService:
    """Service for storing and retrieving analysis data"""
    
    def __init__(self, data_dir: str = "data"):
        """
        Initialize database service
        
        Args:
            data_dir: Directory to store data files
        """
        self.data_dir = data_dir
        self.analyses_file = os.path.join(data_dir, "analyses.json")
        self.analytics_file = os.path.join(data_dir, "analytics.json")
        
        # Create data directory if it doesn't exist
        Path(data_dir).mkdir(parents=True, exist_ok=True)
        
        # Initialize files if they don't exist
        if not os.path.exists(self.analyses_file):
            self._save_json(self.analyses_file, [])
        if not os.path.exists(self.analytics_file):
            self._save_json(self.analytics_file, {
                "total_analyses": 0,
                "total_errors_found": 0,
                "total_fixes_applied": 0,
                "analyses_by_date": {},
                "error_types": {},
                "file_types": {}
            })
    
    def _load_json(self, filepath: str) -> Any:
        """Load JSON from file"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return [] if filepath == self.analyses_file else {}
    
    def _save_json(self, filepath: str, data: Any):
        """Save JSON to file"""
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, default=str)
    
    async def save_analysis(self, analysis_data: Dict[str, Any]) -> str:
        """
        Save analysis to database
        
        Args:
            analysis_data: Analysis data to save
            
        Returns:
            Analysis ID
        """
        analyses = self._load_json(self.analyses_file)
        
        # Generate ID if not present
        if 'id' not in analysis_data:
            analysis_data['id'] = str(uuid.uuid4())
        
        # Add timestamp
        if 'timestamp' not in analysis_data:
            analysis_data['timestamp'] = datetime.utcnow().isoformat()
        
        # Add to analyses
        analyses.append(analysis_data)
        
        # Keep only last 1000 analyses
        if len(analyses) > 1000:
            analyses = analyses[-1000:]
        
        self._save_json(self.analyses_file, analyses)
        
        # Update analytics
        await self._update_analytics(analysis_data)
        
        return analysis_data['id']
    
    async def get_analysis(self, analysis_id: str) -> Optional[Dict[str, Any]]:
        """
        Get analysis by ID
        
        Args:
            analysis_id: Analysis ID
            
        Returns:
            Analysis data or None
        """
        analyses = self._load_json(self.analyses_file)
        for analysis in analyses:
            if analysis.get('id') == analysis_id:
                return analysis
        return None
    
    async def get_recent_analyses(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get recent analyses
        
        Args:
            limit: Maximum number of analyses to return
            
        Returns:
            List of recent analyses
        """
        analyses = self._load_json(self.analyses_file)
        return analyses[-limit:][::-1]  # Return last N in reverse order
    
    async def get_analytics(self) -> Dict[str, Any]:
        """
        Get analytics data
        
        Returns:
            Analytics data
        """
        return self._load_json(self.analytics_file)
    
    async def _update_analytics(self, analysis_data: Dict[str, Any]):
        """
        Update analytics based on new analysis
        
        Args:
            analysis_data: New analysis data
        """
        analytics = self._load_json(self.analytics_file)
        
        # Update totals
        analytics['total_analyses'] = analytics.get('total_analyses', 0) + 1
        
        # Count errors
        errors = analysis_data.get('errors', [])
        analytics['total_errors_found'] = analytics.get('total_errors_found', 0) + len(errors)
        
        # Count fixes
        fixes = analysis_data.get('fixes', [])
        analytics['total_fixes_applied'] = analytics.get('total_fixes_applied', 0) + len(fixes)
        
        # Update by date
        date = datetime.utcnow().strftime('%Y-%m-%d')
        if 'analyses_by_date' not in analytics:
            analytics['analyses_by_date'] = {}
        if date not in analytics['analyses_by_date']:
            analytics['analyses_by_date'][date] = {
                'analyses': 0,
                'errors': 0,
                'fixes': 0
            }
        analytics['analyses_by_date'][date]['analyses'] += 1
        analytics['analyses_by_date'][date]['errors'] += len(errors)
        analytics['analyses_by_date'][date]['fixes'] += len(fixes)
        
        # Update error types
        if 'error_types' not in analytics:
            analytics['error_types'] = {}
        for error in errors:
            error_type = error.get('category', 'unknown')
            analytics['error_types'][error_type] = analytics['error_types'].get(error_type, 0) + 1
        
        # Update file types
        if 'file_types' not in analytics:
            analytics['file_types'] = {}
        file_type = analysis_data.get('language', 'unknown')
        if file_type not in analytics['file_types']:
            analytics['file_types'][file_type] = {
                'count': 0,
                'errors': 0
            }
        analytics['file_types'][file_type]['count'] += 1
        analytics['file_types'][file_type]['errors'] += len(errors)
        
        self._save_json(self.analytics_file, analytics)
    
    async def get_heatmap_data(self, analysis_id: str) -> List[Dict[str, Any]]:
        """
        Get heatmap data for an analysis
        
        Args:
            analysis_id: Analysis ID
            
        Returns:
            Heatmap data
        """
        analysis = await self.get_analysis(analysis_id)
        if not analysis:
            return []
        
        return analysis.get('heatmap', [])
    
    async def search_analyses(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Search analyses by query
        
        Args:
            query: Search query
            limit: Maximum results
            
        Returns:
            Matching analyses
        """
        analyses = self._load_json(self.analyses_file)
        results = []
        
        query_lower = query.lower()
        for analysis in analyses:
            # Search in various fields
            if (query_lower in str(analysis.get('input', '')).lower() or
                query_lower in str(analysis.get('type', '')).lower() or
                any(query_lower in str(error.get('message', '')).lower() 
                    for error in analysis.get('errors', []))):
                results.append(analysis)
                if len(results) >= limit:
                    break
        
        return results[::-1]  # Return in reverse order (newest first)


# Global database service instance
db_service = DatabaseService()

# Made with Bob
