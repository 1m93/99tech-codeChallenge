// missing imports

interface WalletBalance {
	currency: string;
	amount: number;
	// missing blockchain property
}
interface FormattedWalletBalance {
	currency: string;
	amount: number;
	formatted: string;
}

interface Props extends BoxProps {} // should import BoxProps

// WalletPage is not exported
const WalletPage: React.FC<Props> = (props: Props) => {
	const { children, ...rest } = props; // children is not used, should be removed if not needed
	const balances = useWalletBalances(); // should import useWalletBalances
	const prices = usePrices(); // should import usePrices

	/**
	 * should define type for blockchain, maybe string or an enum.
	 * should define this function outside of the component to avoid re-creation on every render.
	 */
	const getPriority = (blockchain: any): number => {
		switch (blockchain) {
			case 'Osmosis':
				return 100;
			case 'Ethereum':
				return 50;
			case 'Arbitrum':
				return 30;
			case 'Zilliqa': // Zilliqa and Neo have the same return value, could be combined
				return 20;
			case 'Neo':
				return 20;
			default:
				return -99;
		}
	};

	const sortedBalances = useMemo(() => { // should import useMemo from 'react'
		// should create a map with blockchain priorities to avoid multiple calls to getPriority

		return balances
			.filter((balance: WalletBalance) => {
				const balancePriority = getPriority(balance.blockchain); // this constant is not used
				if (lhsPriority > -99) {
					// lhsPriority does not exist, could this be balancePriority?
					if (balance.amount <= 0) { // in a wallet app, we should show balances > 0? but maybe this is a filter for debts or negative balances
						return true; // we should return lhsPriority > -99 && balance.amount <= 0 instead of nested conditionals
					}
				}
				return false;
			})
			.sort((lhs: WalletBalance, rhs: WalletBalance) => {
				const leftPriority = getPriority(lhs.blockchain);
				const rightPriority = getPriority(rhs.blockchain);

				// just need to return rightPriority - leftPriority to sort in descending order, this will also handle the case when priorities are equal
				if (leftPriority > rightPriority) {
					return -1;
				} else if (rightPriority > leftPriority) {
					return 1;
				}

				// missing default return for sort method, what will happen if priorities are equal?
			});
	}, [balances, prices]); // prices is not used in this useMemo

	// This function was defined but not used
	const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
		return {
			...balance,
			formatted: balance.amount.toFixed(),
		};
	});

	// No need to iterate again here, we can move this logic into the sortedBalance useMemo above to reduce iterations and have memoization benefits.
	const rows = sortedBalances.map(
		/**
		 * balance from sortedBalances has type WalletBalance, but we have FormattedWalletBalance here -> type mismatch
		 * should use formattedBalances instead of sortedBalances because it contains the formatted property
		 */
		(balance: FormattedWalletBalance, index: number) => {
			const usdValue = prices[balance.currency] * balance.amount;
			return (
				<WalletRow
					className={classes.row} // what is classes? It is not defined in the provided code.
					key={index} // using index as key is not recommended, if balance has a unique identifier, use that instead
					amount={balance.amount}
					usdValue={usdValue}
					formattedAmount={balance.formatted} // assuming formattedAmount is just the string representation of amount, it should be handle inside WalletRow component
				/>
			);
		}
	);

	return <div {...rest}>{rows}</div>;
};
