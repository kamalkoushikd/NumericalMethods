use num_bigint::BigUint;
use num_traits::{One, Zero, Pow};
use std::str::FromStr;

/// --- Simple primality ---
/// For u64
fn is_prime_u64(n: u64) -> bool {
    primal::is_prime(n)
}

/// Miller–Rabin primality check for BigUint (stub version)
fn is_prime_big(n: &BigUint) -> bool {
    if let Some(val) = n.to_u64_digits().get(0) {
        return primal::is_prime(*val); // fallback to primal for small nums
    }
    // TODO: Replace with Miller–Rabin
    false
}

/// Build number of form 123...n...(n-1)...321
fn next_pattern_number(n: u32) -> BigUint {
    let mut forward = String::new();
    for i in 1..=n {
        forward.push_str(&i.to_string());
    }
    for i in (1..n).rev() {
        forward.push_str(&i.to_string());
    }
    BigUint::from_str(&forward).unwrap()
}

/// Generate repunit R_N = (10^N - 1)/9
fn generate_repunit(n: u32) -> BigUint {
    (BigUint::from(10u32).pow(n) - BigUint::one()) / BigUint::from(9u32)
}

/// Make palindrome from string s
fn palindrome_number(s: &str) -> BigUint {
    let rev: String = s.chars().rev().collect();
    let pal = format!("{}{}", s, rev);
    BigUint::from_str(&pal).unwrap()
}

/// ------------------
/// Problems
/// ------------------

/// Problem 1: Generate number of pattern and check primality
fn problem1(n: u32, max_n: u32) {
    for i in n..=max_n {
        if i >= 1000 && i <= 3000 {
            let num = next_pattern_number(i);
            if is_prime_big(&num) {
                println!("Problem1: Found prime pattern {}", num);
                return;
            }
        }
    }
    println!("Problem1: No prime found");
}

/// Problem 2: Repunit primes
fn problem2(limit: u32) {
    for n in 2..=limit {
        if is_prime_u64(n as u64) {
            let rep = generate_repunit(n);
            if is_prime_big(&rep) {
                println!("Problem2: N={} Repunit={}", n, rep);
            }
        }
    }
}

/// Problem 3: Mersenne primes 2^p - 1
fn problem3(start: u32, end: u32) {
    for p in start..=end {
        if is_prime_u64(p as u64) {
            let m = (BigUint::from(2u32).pow(p)) - BigUint::one();
            if is_prime_big(&m) {
                println!("Problem3: p={} Mersenne={}", p, m);
            }
        }
    }
}

/// Problem 4: Find primes between p1^2 and p2^2
fn problem4(p1: u64, p2: u64) {
    let lower = p1 * p1;
    let upper = p2 * p2;
    let mut found = vec![];
    for n in (lower + 1)..upper {
        if is_prime_u64(n) {
            found.push(n);
            if found.len() >= 10 {
                break;
            }
        }
    }
    println!("Problem4: Interval=({}, {}) Primes={:?}", lower, upper, found);
}

/// Problem 5: Find palindromic prime with at least `limit_digits`
fn problem5(limit_digits: u32) {
    let mut n = BigUint::from(10u32).pow(limit_digits - 1);
    loop {
        let s = n.to_string();
        let pal = palindrome_number(&s);
        if is_prime_big(&pal) {
            println!(
                "Problem5: Palindromic prime {} with {} digits",
                pal,
                pal.to_string().len()
            );
            break;
        }
        n += BigUint::one();
    }
}

/// Problem 6: Generate perfect number from Mersenne prime
fn problem6(p: u32) {
    let mersenne = (BigUint::from(2u32).pow(p)) - BigUint::one();
    if is_prime_big(&mersenne) {
        let perfect = (BigUint::from(2u32).pow(p - 1)) * mersenne;
        println!("Problem6: Perfect number = {}", perfect);
    } else {
        println!("Problem6: No perfect number for p={}", p);
    }
}

/// Problem 7: Goldbach’s conjecture
fn problem7(even_n: u64) {
    if even_n % 2 != 0 || even_n <= 2 {
        println!("Problem7: Input must be even > 2");
        return;
    }
    for i in 2..even_n {
        if is_prime_u64(i) && is_prime_u64(even_n - i) {
            println!("Problem7: {} = {} + {}", even_n, i, even_n - i);
            return;
        }
    }
    println!("Problem7: No pair found for {}", even_n);
}

/// ------------------
/// Main entry
/// ------------------
fn main() {
    problem1(10, 3000);
    problem2(50);
    problem3(2, 31);
    problem4(10, 20);
    problem5(5);  // 5-digit palindromic prime
    problem6(5);
    problem7(20);
}
