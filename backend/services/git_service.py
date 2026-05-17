"""
Git Service for repository operations
Handles cloning, file reading, and repository analysis
"""
import os
import shutil
import tempfile
from typing import List, Dict, Any, Optional
from pathlib import Path
import subprocess


class GitService:
    """Service for Git repository operations"""
    
    def __init__(self):
        """Initialize Git service"""
        self.temp_dir = tempfile.gettempdir()
    
    async def clone_repository(self, repo_url: str, branch: str = "main") -> str:
        """
        Clone a Git repository to temporary directory
        
        Args:
            repo_url: Repository URL (https or git)
            branch: Branch to clone (default: main)
            
        Returns:
            Path to cloned repository
        """
        # Create unique temp directory for this repo
        repo_name = repo_url.split("/")[-1].replace(".git", "")
        repo_path = os.path.join(self.temp_dir, f"devassist_{repo_name}_{os.getpid()}")
        
        # Remove if exists
        if os.path.exists(repo_path):
            shutil.rmtree(repo_path)
        
        try:
            # Clone repository
            subprocess.run(
                ["git", "clone", "--depth", "1", "--branch", branch, repo_url, repo_path],
                check=True,
                capture_output=True,
                text=True
            )
            return repo_path
        except subprocess.CalledProcessError as e:
            # Try with default branch if specified branch fails
            if branch != "main":
                try:
                    subprocess.run(
                        ["git", "clone", "--depth", "1", repo_url, repo_path],
                        check=True,
                        capture_output=True,
                        text=True
                    )
                    return repo_path
                except subprocess.CalledProcessError:
                    raise Exception(f"Failed to clone repository: {e.stderr}")
            raise Exception(f"Failed to clone repository: {e.stderr}")
    
    async def get_repository_files(self, repo_path: str, extensions: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        """
        Get all files from repository
        
        Args:
            repo_path: Path to cloned repository
            extensions: Optional list of file extensions to filter (e.g., ['.py', '.js'])
            
        Returns:
            List of files with path, content, and metadata
        """
        files = []
        
        # Default extensions for code files
        if extensions is None:
            extensions = [
                '.py', '.js', '.ts', '.jsx', '.tsx', '.java', '.cpp', '.c', '.h',
                '.cs', '.go', '.rs', '.rb', '.php', '.swift', '.kt', '.scala',
                '.html', '.css', '.scss', '.sass', '.vue', '.svelte'
            ]
        
        # Walk through repository
        for root, dirs, filenames in os.walk(repo_path):
            # Skip hidden directories and common ignore patterns
            dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['node_modules', 'venv', '__pycache__', 'dist', 'build']]
            
            for filename in filenames:
                file_path = os.path.join(root, filename)
                relative_path = os.path.relpath(file_path, repo_path)
                
                # Check extension
                if any(filename.endswith(ext) for ext in extensions):
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        
                        # Get file stats
                        stats = os.stat(file_path)
                        
                        files.append({
                            'path': relative_path,
                            'filename': filename,
                            'content': content,
                            'size': stats.st_size,
                            'lines': len(content.splitlines()),
                            'extension': Path(filename).suffix,
                            'language': self._detect_language(filename)
                        })
                    except (UnicodeDecodeError, PermissionError):
                        # Skip binary files or files we can't read
                        continue
        
        return files
    
    async def get_file_content(self, repo_path: str, file_path: str) -> Optional[str]:
        """
        Get content of a specific file
        
        Args:
            repo_path: Path to cloned repository
            file_path: Relative path to file
            
        Returns:
            File content or None if not found
        """
        full_path = os.path.join(repo_path, file_path)
        
        if not os.path.exists(full_path):
            return None
        
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                return f.read()
        except (UnicodeDecodeError, PermissionError):
            return None
    
    async def cleanup_repository(self, repo_path: str):
        """
        Clean up cloned repository
        
        Args:
            repo_path: Path to cloned repository
        """
        if os.path.exists(repo_path):
            try:
                shutil.rmtree(repo_path)
            except Exception as e:
                print(f"Failed to cleanup repository: {e}")
    
    def _detect_language(self, filename: str) -> str:
        """
        Detect programming language from filename
        
        Args:
            filename: Name of file
            
        Returns:
            Language name
        """
        extension_map = {
            '.py': 'python',
            '.js': 'javascript',
            '.ts': 'typescript',
            '.jsx': 'javascript',
            '.tsx': 'typescript',
            '.java': 'java',
            '.cpp': 'cpp',
            '.c': 'c',
            '.h': 'c',
            '.cs': 'csharp',
            '.go': 'go',
            '.rs': 'rust',
            '.rb': 'ruby',
            '.php': 'php',
            '.swift': 'swift',
            '.kt': 'kotlin',
            '.scala': 'scala',
            '.html': 'html',
            '.css': 'css',
            '.scss': 'scss',
            '.sass': 'sass',
            '.vue': 'vue',
            '.svelte': 'svelte'
        }
        
        ext = Path(filename).suffix.lower()
        return extension_map.get(ext, 'unknown')
    
    async def get_repository_stats(self, repo_path: str) -> Dict[str, Any]:
        """
        Get repository statistics
        
        Args:
            repo_path: Path to cloned repository
            
        Returns:
            Repository statistics
        """
        files = await self.get_repository_files(repo_path)
        
        # Calculate statistics
        total_lines = sum(f['lines'] for f in files)
        language_distribution = {}
        
        for file in files:
            lang = file['language']
            if lang not in language_distribution:
                language_distribution[lang] = {'files': 0, 'lines': 0}
            language_distribution[lang]['files'] += 1
            language_distribution[lang]['lines'] += file['lines']
        
        return {
            'total_files': len(files),
            'total_lines': total_lines,
            'language_distribution': language_distribution,
            'average_file_size': sum(f['size'] for f in files) / len(files) if files else 0
        }


# Global Git service instance
git_service = GitService()

# Made with Bob
