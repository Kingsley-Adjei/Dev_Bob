"""
API Key authentication for DevAssist
Supports both X-API-Key header and Authorization Bearer token
"""
from fastapi import Header, HTTPException, status, Request
from typing import Optional
from config import settings


class AuthenticationError(Exception):
    """Custom exception for authentication failures"""
    pass


async def verify_api_key(
    request: Request,
    x_api_key: Optional[str] = Header(None, description="API Key for authentication"),
    authorization: Optional[str] = Header(None, description="Bearer token for authentication")
) -> str:
    """
    Verify API key from request header (supports both X-API-Key and Bearer token)
    
    Args:
        request: FastAPI request object
        x_api_key: API key from X-API-Key header
        authorization: Bearer token from Authorization header
        
    Returns:
        The validated API key
        
    Raises:
        HTTPException: If API key is invalid or missing
    """
    # Allow OPTIONS requests (CORS preflight) without authentication
    if request.method == "OPTIONS":
        return "preflight"
    
    valid_keys = settings.api_keys_list
    
    # Try X-API-Key header first
    if x_api_key:
        if x_api_key in valid_keys:
            return x_api_key
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid API key",
                headers={"WWW-Authenticate": "ApiKey"},
            )
    
    # Try Authorization Bearer token
    if authorization:
        if authorization.startswith("Bearer "):
            token = authorization[7:]  # Remove "Bearer " prefix
            if token in valid_keys:
                return token
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid bearer token",
                    headers={"WWW-Authenticate": "Bearer"},
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization header format. Use 'Bearer {token}'",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    # No authentication provided
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required. Provide X-API-Key header or Authorization Bearer token",
        headers={"WWW-Authenticate": "ApiKey, Bearer"},
    )


def get_api_key_header():
    """
    Dependency function to get API key from header
    Can be used as a dependency in route decorators
    """
    return Header(..., alias="X-API-Key", description="API Key for authentication")

# Made with Bob
