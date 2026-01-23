// track page

import CustomerOrderTrack from '@/app/Dashboard/Shop/CustomerOrderTrack/CustomerOrderTrack';

export const metadata = {
    title: 'Track Your Order | SOOQRA ONE',
    description: 'Track your order status and get real-time updates on your SOOQRA ONE purchase.',
};

const page = () => {
    return (
        <div>
            <CustomerOrderTrack />
        </div>
    );
};

export default page;