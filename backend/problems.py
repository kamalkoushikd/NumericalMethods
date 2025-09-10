from math import sqrt
from sympy import isprime
from random import randrange

# -------------------------------
# Utility Functions
# -------------------------------

# Using a more robust primality test from a library like sympy for efficiency
# and accuracy, especially for larger numbers. The original is_prime is slow.

def is_prime(n: int) -> bool:
    """Check if n is prime using sympy's isprime."""
    return isprime(n)

def next_pattern_number(n: int) -> int:
    """Builds number of form 123...n...(n-1)...321."""
    if n > 9:
        forward = "".join(str(i) for i in range(1, 10))
        forward += "".join(str(i) for i in range(10, n+1))
    else:
        forward = "".join(str(i) for i in range(1, n+1))

    if n > 9:
        backward = "".join(str(i) for i in range(n-1, 9, -1))
        backward += "".join(str(i) for i in range(9, 0, -1))
    else:
        backward = "".join(str(i) for i in range(n-1, 0, -1))

    return int(forward + backward)

def generate_repunit(N: int) -> int:
    """Generate repunit 1N = (10^N - 1) / 9."""
    return (10**N - 1) // 9

def palindrome_number(s: str) -> str:
    """Make palindrome from string s (helper)."""
    return s + s[::-1]

def miller_rabin(n: int, k: int = 40) -> bool:
    """Miller-Rabin primality test for large numbers."""
    if n < 2:
        return False
    if n in (2, 3):
        return True
    if n % 2 == 0:
        return False

    # Write n-1 as 2^r * d
    r, d = 0, n - 1
    while d % 2 == 0:
        d //= 2
        r += 1

    for _ in range(k):
        a = randrange(2, n - 1)
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        for _ in range(r - 1):
            x = pow(x, 2, n)
            if x == n - 1:
                break
        else:
            return False
    return True

# -------------------------------
# Problem Functions
# -------------------------------

def problem1(llimit: int = 1000, ulimit: int = 3000):
    """
    Problem 1:
    Find the next number following the pattern 123...n...(n-1)...321
    where n lies between 1000 and 3000.
    Uses Miller-Rabin for efficiency with large numbers.
    """
    for n in range(llimit, ulimit + 1):
        num = next_pattern_number(n)
        if miller_rabin(num):   # Replaced is_prime(num)
            return {"n": n, "pattern_number": str(num), "is_prime": True}
            print(f"Found prime pattern number: {num} for n={n}")
    return {"n": None, "pattern_number": None, "is_prime": False}


def problem2(llimit: int = 2, ulimit: int = 1040):
    """
    Problem 2:
    Determine the 5 repunit primes where N is prime between 2 and 1040.
    """
    repunit_primes = []
    # Known repunit primes for prime N
    known_repunit_primes = {2, 19, 23, 317, 1031}
    for N in range(llimit, ulimit + 1):
        if is_prime(N):
            # if N in known_repunit_primes:
            if is_prime(generate_repunit(N)):
                repunit_primes.append({"N": N, "repunit": str(generate_repunit(N))})

    # We return the first 5 known repunit primes in the range
    return repunit_primes

#final
def problem3(start: int = 2201, end: int = 2299):
    """
    Problem 3:
    Find Mersenne primes 2^p - 1 where p is prime in the range 2201 and 2299.
    """
    results = []
    # Loop through odd numbers in the range
    if start % 2 == 0:
        start += 1  # Ensure starting with an odd number
    for p in range(start, end + 1, 2):
        if is_prime(p):
            m = 2**p - 1
            if is_prime(m):
                results.append({"p": p, "mersenne_prime": m})
    return results

#final
def problem4(p1: int, p2: int):
    """
    Problem 4:
    Find at least 4 primes between p1^2 and p2^2.
    """
    lower = p1**2
    upper = p2**2
    primes_found = []
    for n in range(lower + 1, upper):
        if is_prime(n):
            primes_found.append(n)
            if len(primes_found) >= 4:
                break
    return {"interval": (lower, upper), "primes_found": primes_found}


# def problem5(limit_digits: int = 50):
#     """
#     Problem 5:
#     Find a palindromic prime with at least 50 digits.
#     This is computationally expensive. This function will return a known
#     palindromic prime of at least 50 digits.
#     """
#     # A known palindromic prime with more than 50 digits
#     known_palindromic_prime = 100000000000000000000000000000000000000000000000001
#     if len(str(known_palindromic_prime)) >= limit_digits and is_prime(known_palindromic_prime):
#         return {"palindromic_prime": known_palindromic_prime, "digits": len(str(known_palindromic_prime))}
#     else:
#         # Fallback or search logic (search is impractical for this problem)
#         return {"palindromic_prime": None, "digits": 0}



def problem5(num_digits: int):
    """
    Generalized function to find a palindromic prime with at least num_digits using Miller-Rabin.
    """
    if num_digits < 2:
        return {"error": "Number of digits must be at least 2"}

    # Start the search from the smallest possible number with num_digits
    half_len = (num_digits + 1) // 2
    start_half = 10**(half_len - 1)
    end_half = 10**half_len

    # Loop to find a palindromic prime of at least num_digits
    while True:
        for half in range(start_half, end_half):
            s = str(half)
            if num_digits % 2 == 0:
                candidate = int(s + s[::-1])
            else:
                candidate = int(s + s[-2::-1])

            # The check `len(str(candidate)) >= num_digits` is not needed with this logic
            if miller_rabin(candidate):
                return {"palindromic_prime": candidate, "digits": len(str(candidate))}

        # If no palindromic prime is found in the current number of digits,
        # increment to the next number of digits and continue the search
        num_digits += 1
        half_len = (num_digits + 1) // 2
        start_half = 10**(half_len - 1)
        end_half = 10**half_len
#final
# def problem5_miller_rabin(limit_digits: int = 50):
#     """
#     Find a palindromic prime with at least 50 digits using Miller-Rabin test.
#     """
#     # Start with the smallest 50-digit palindrome
#     half = "1" + "0" * 24
#     candidate = int(half + half[::-1])

#     while True:
#         if miller_rabin(candidate):
#             return {"palindromic_prime": candidate, "digits": len(str(candidate))}

#         # This part has a logic flaw. It increments the number and then rebuilds the palindrome.
#         # This approach is inefficient and likely to miss many potential palindromes.
#         # A better approach is to increment the first half and then rebuild the full palindrome.

#         # Correctly generate the next palindrome
#         half_int = int(str(candidate)[:25])
#         half_int += 1
#         s = str(half_int)

#         candidate = int(s + s[::-1])


def problem7(even_n: int = 20):
    """
    Problem 7 (example):
    Goldbach's conjecture - every even n > 2 is sum of two primes.
    Return one such pair.
    """
    if even_n % 2 != 0 or even_n <= 2:
        return {"error": "Input must be even > 2"}

    for i in range(2, even_n):
        if is_prime(i) and is_prime(even_n - i):
            return {"n": even_n, "pair": (i, even_n - i)}

    return {"n": even_n, "pair": None}
