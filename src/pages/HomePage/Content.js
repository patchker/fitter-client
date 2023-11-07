import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function Content() {
    return (
        <div className="flex flex-col justify-center items-center h-full border-2 border-gray-100 p-4 space-y-4 pt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="flex flex-col space-y-4">

                        <Skeleton width={200} height={40}/>
                        <Skeleton width={300} height={20}/>
                        <Skeleton width={250} height={20}/>
                        <Skeleton width={280} height={20}/>
                        <Skeleton width={150} height={150} circle={true}/>

                        <div className="w-full flex flex-col space-y-2">
                            {[...Array(5)].map((item, index) => (
                                <Skeleton key={index} width="100%" height={20}/>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Content;
