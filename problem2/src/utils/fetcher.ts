/* eslint-disable @typescript-eslint/no-explicit-any */

import useLoadingStore from '@/stores/loading';
import { toast } from 'react-toastify';

export async function fetcher<T = void, P = void>(params: {
	callback: (...args: P[]) => Promise<T>;
	showToast?: {
		failed?: boolean;
		success?: boolean;
	};
	successCallback?: (res: T) => void;
	failedCallback?: (err: any) => void;
	finallyCallback?: () => void;
	messages?: {
		success?: string;
		failed?: string;
	};
	showLoading?: boolean;
}): Promise<void> {
	const {
		callback,
		successCallback,
		failedCallback,
		finallyCallback,
		showLoading = true,
		showToast = {
			failed: true,
			success: true,
		},
	} = params;

	try {
		if (showLoading) {
			useLoadingStore.getState().setLoading(true);
		}

		const res = await callback();

		successCallback?.(res);
		if (showToast.success || showToast.success == null) {
			toast.success(params.messages?.success || 'Operation successful');
		}
	} catch (err) {
		failedCallback?.(err);
		if (showToast.failed || showToast.failed == null) {
			toast.error(
				params.messages?.failed || 'Operation failed. Please try again.'
			);
		}
	} finally {
		if (showLoading) {
			useLoadingStore.getState().setLoading(false);
		}

		finallyCallback?.();
	}
}
