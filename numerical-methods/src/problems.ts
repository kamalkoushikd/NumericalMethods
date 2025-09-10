import {
  Hash,
  Infinity as InfinityIcon,
  ArrowRightLeft,
  Sparkles,
  Binary,
  Sigma,
  Grid3x3,
} from "lucide-react";

export const problems = [
  {
    id: 1,
    title: "Prime Sequence",
    description: "Find the nth prime number within a maximum limit",
    icon: Hash,
    inputs: { n: "10", max_n: "3000" },
  },
  {
    id: 2,
    title: "Repunit Primes",
    description: "Calculate the indices of repunit primes in a range",
    icon: InfinityIcon,
    inputs: { limit: "50" },
  },
  {
    id: 3,
    title: "Mersenne Primes",
    description: "Find Mersenne primes within a specified range",
    icon: ArrowRightLeft,
    inputs: { start: "2", end: "31" },
  },
  {
    id: 4,
    title: "Primes between squares of primes",
    description: "Brocard's conjecture exploration",
    icon: Sparkles,
    inputs: { p1: "13", p2: "17" },
  },
  {
    id: 5,
    title: "Prime Palindromes",
    description: "Palindromic primes of specific digit lengths",
    icon: Binary,
    inputs: { limit_digits: "10" },
  },
  {
    id: 6,
    title: "Perfect Numbers",
    description: "Proof for Perfect Numbers using Mersenne primes",
    icon: Sigma,
    inputs: { p: "5" },
  },
  {
    id: 7,
    title: "Even Prime",
    description: "Goldbah's conjecture verification",
    icon: Grid3x3,
    inputs: { even_n: "20" },
  },
];
