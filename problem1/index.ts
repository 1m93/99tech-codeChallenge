export const sumToNA = (n: number) => (n * (n + 1)) / 2;

export const sumToNB = (n: number) => {
	let result = 0;

	for (let i = 1; i <= n; i++) {
		result += i;
	}

	return result;
};

// This way of calculating the sum is not efficient for large n, as it uses recursion.
export const sumToNC = (n: number) => {
	if (n <= 1) {
		return n;
	}

	return n + sumToNC(n - 1);
};

// This way could be used for large n, but it is not efficient in terms of memory usage.
export const sumToND = (n: number) => Array.from({ length: n }, (_, i) => i + 1).reduce(
  (acc, curr) => acc + curr,
  0
);
