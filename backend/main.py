from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import problems as problems
import sys
import asyncio

sys.set_int_max_str_digits(9000)

app = FastAPI(title="Prime Problems API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],  # or restrict to ["POST"]
    allow_headers=["*"],
)

# -------------------------------
# Request Models
# -------------------------------
class Problem1Input(BaseModel):
    n: int = 10
    max_n: int = 3000

class Problem2Input(BaseModel):
    limit: int = 50

class Problem3Input(BaseModel):
    start: int = 2
    end: int = 31

class Problem4Input(BaseModel):
    p1: int
    p2: int

class Problem5Input(BaseModel):
    limit_digits: int = 10

class Problem6Input(BaseModel):
    p: int = 5

class Problem7Input(BaseModel):
    even_n: int = 20


# -------------------------------
# Endpoints (Async)
# -------------------------------
@app.post("/problem1")
async def solve_problem1(data: Problem1Input):
    return await asyncio.to_thread(problems.problem1, data.n, data.max_n)

@app.post("/problem2")
async def solve_problem2(data: Problem2Input):
    return await asyncio.to_thread(problems.problem2, data.limit)

@app.post("/problem3")
async def solve_problem3(data: Problem3Input):
    return await asyncio.to_thread(problems.problem3, data.start, data.end)

@app.post("/problem4")
async def solve_problem4(data: Problem4Input):
    return await asyncio.to_thread(problems.problem4, data.p1, data.p2)

@app.post("/problem5")
async def solve_problem5(data: Problem5Input):
    return await asyncio.to_thread(problems.problem5, data.limit_digits)


@app.post("/problem7")
async def solve_problem7(data: Problem7Input):
    return await asyncio.to_thread(problems.problem7, data.even_n)
