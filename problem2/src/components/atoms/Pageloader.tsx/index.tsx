type PageLoaderProps = {
  message?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ message = 'Loading...' }) => {
  return (
		<div className="fixed inset-0 flex items-center justify-center bg-[#ffffffb8] z-50">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" />
				<p className="text-gray-600 text-xl font-bold">{message}</p>
			</div>
		</div>
	);
};

export default PageLoader;