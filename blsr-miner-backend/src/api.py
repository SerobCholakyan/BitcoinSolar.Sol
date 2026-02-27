from fastapi import APIRouter
from mining import mine_block
from watcher import get_status

router = APIRouter()

@router.get("/mine")
def mine():
    return mine_block()

@router.get("/status")
def status():
    return get_status()
