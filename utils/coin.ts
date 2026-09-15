


export const formatCoin = function(amount : number){
    return new Intl.NumberFormat('pt-Pt', {currency: 'eur', style: 'currency', currencySign: 'accounting'}).format(amount)
}