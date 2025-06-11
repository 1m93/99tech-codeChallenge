import { ToastContainer } from 'react-toastify';
import CurrencyForm from './components/organisms/CurrencyForm';
import useLoadingStore from './stores/loading';
import PageLoader from './components/atoms/Pageloader.tsx';

function App() {
	const { loading } = useLoadingStore();

	return (
		<div className="flex justify-center items-center min-h-screen p-4">
			{loading() && <PageLoader />}
			<ToastContainer stacked position="top-center" />
			<CurrencyForm />
		</div>
	);
}

export default App;
