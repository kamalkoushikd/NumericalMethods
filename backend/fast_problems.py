# from sympy import primes.check
from primePy import primes

def next_pattern_number(n: int) -> int:
    """Builds number of form 123...n...(n-1)...321."""
    forward = "".join(str(i) for i in range(1, n + 1))
    backward = "".join(str(i) for i in range(n - 1, 0, -1))
    return int(forward + backward)

def generate_repunit(N: int) -> int:
    """Generate repunit R_N = (10^N - 1) / 9."""
    return (10**N - 1) // 9

def palindrome_number(s: str) -> str:
    """Make palindrome from string s."""
    return s + s[::-1]


# ------------------------------
# Problem Functions (Optimized)
# ------------------------------

def problem1(n: int = 10, max_n: int = 3000):
    """
    Problem 1:
    Generate number of given pattern and check primality.
    """
    for i in range(n, max_n + 1):
        if 1000 <= i <= 3000:
            num = next_pattern_number(i)
            if primes.check(num):
                print(num)
                return {"pattern_number": num, "is_prime": True}
    return {"pattern_number": None, "is_prime": False}


def problem2(limit: int = 50):
    """
    Problem 2:
    Repunit primes between N=2 and limit.
    """
    results = []
    for N in range(2, limit + 1):
        if primes.check(N):
            rep = generate_repunit(N)
            results.append({"N": N, "repunit": str(rep)})
    return results


def problem3(start: int = 2, end: int = 31):
    """
    Problem 3:
    Find Mersenne primes 2^p - 1 where p is prime in range.
    """
    results = [] #exclusively use the sympy primes.check fucntion in the fastproblems code
    for p in range(start, end + 1):
        if primes.check(p):
            m = 2**p - 1
            if primes.check(m):
                results.append({"p": p, "mersenne_prime": m})
    return results


def problem4(p1: int, p2: int):
    """
    Problem 4:
    Find at least 4 primes between p1^2 and p2^2.
    """
    lower = p1**2
    upper = p2**2
    primes = [n for n in range(lower + 1, upper) if primes.check(n)]
    return {"interval": (lower, upper), "primes_found": primes[:10]}


def problem5(limit_digits: int = 10):
    """
    Problem 5:
    Find palindromic prime with at least `limit_digits`.
    """
    n = 10**(limit_digits - 1)
    while True:
        s = str(n)
        pal = int(palindrome_number(s))
        if primes.check(pal):
            return {"palindromic_prime": pal, "digits": len(str(pal))}
        n += 1


def problem6(p: int = 5):
    """
    Problem 6:
    Generate perfect number using Mersenne prime formula.
    """
    if primes.check(2**p - 1):
        perfect = 2**(p - 1) * (2**p - 1)
        return {"p": p, "perfect_number": perfect}
    else:
        return {"p": p, "perfect_number": None}


def problem7_goldbach(even_n: int = 20):
    """
    Problem 7 (example):
    Goldbach's conjecture - every even n > 2 is sum of two primes.
    """
    if even_n % 2 != 0 or even_n <= 2:
        return {"error": "Input must be even > 2"}

    for i in range(2, even_n):
        if primes.check(i) and primes.check(even_n - i):
            return {"n": even_n, "pair": (i, even_n - i)}

    return {"n": even_n, "pair": None}
