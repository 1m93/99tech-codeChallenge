import React, { useMemo } from 'react';
// should add other imports

type BlockChain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

interface WalletBalance {
	currency: string;
	amount: number;
	blockchain: BlockChain;
}

interface WalletBalanceWithPriority extends WalletBalance {
	priority: number;
}

interface Props extends BoxProps {} // should import BoxProps

const getPriority = (blockchain: BlockChain): number => {
	switch (blockchain) {
		case 'Osmosis':
			return 100;
		case 'Ethereum':
			return 50;
		case 'Arbitrum':
			return 30;
		case 'Zilliqa':
		case 'Neo':
			return 20;

		default:
			return -99;
	}
};

const WalletPage: React.FC<Props> = (props: Props) => {
	const balances = useWalletBalances(); // should import useWalletBalances
	const prices = usePrices(); // should import usePrices

	const sortedBalances: WalletBalanceWithPriority[] = useMemo(() => {
    // Create an array of balances with their priorities
		const balancesWithPriority: WalletBalanceWithPriority[] = balances.map(
			(balance: WalletBalance) => ({
				...balance,
				priority: getPriority(balance.blockchain),
			})
		);

		return balancesWithPriority
			.filter((balance) => balance.priority > -99 && balance.amount <= 0) // don't know about the app's logic about showing balances, so i keep it as is
			.sort((lhs, rhs) => rhs.priority - lhs.priority);
	}, [balances]);

	const rows = useMemo(
		() =>
			sortedBalances.map((balance, index) => {
				const usdValue = prices[balance.currency] * balance.amount;

				return (
					<WalletRow
						className={classes.row} // should import classes from a CSS module or define styles
						key={index} // if balance has a unique identifier, use that instead
						amount={balance.amount}
						usdValue={usdValue}
						formattedAmount={balance.amount.toFixed()} // don't know how WalletRow is defined, so i keep it as is. But it should be handled inside WalletRow
					/>
				);
			}),
		[sortedBalances, prices]
	);

	return <div {...props}>{rows}</div>;
};

export default WalletPage;
