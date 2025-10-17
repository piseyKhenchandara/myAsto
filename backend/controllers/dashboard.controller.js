export const dashboard = async (req, res) => {

    const toalRevenue = await db.payment.sum('amount',{ where : {status : 'paid' }}) || 0;
    

     
}