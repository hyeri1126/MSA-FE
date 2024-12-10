export const formatWooriAccountNumber = (accountNumber) => {
    const formattedNumber = accountNumber.replace(/(\d{4})(\d{3})(\d{6})/, '$1-$2-$3');
    return formattedNumber;
};

export const formatBusinessNumber = (businessNumber) => {
    const cleanNumber = businessNumber.replace(/[^0-9]/g, '');
    const formattedNumber = cleanNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
    return formattedNumber;
};