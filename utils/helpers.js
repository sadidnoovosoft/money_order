// Function to format transactions into an HTML table
function formatDataToHTML(transactions) {
    const style = '"border: 1px solid black; padding: 8px;"';
    let htmlTable = `<table style="border: 1px solid black;">`;

    // Create table header row
    htmlTable += '<tr>';
    htmlTable += `<td style=${style} >Type</th>`;
    htmlTable += `<td style=${style} >From</th>`;
    htmlTable += `<td style=${style} >To</th>`;
    htmlTable += `<td style=${style} >Amount</th>`;
    htmlTable += '</tr>';

    // Create table rows with transaction data
    transactions.forEach(({id, type, from_name, to_name, amount}) => {
        htmlTable += `<tr id=${id}>`;
        htmlTable += `<td style=${style} >${type}</td>`;
        htmlTable += `<td style=${style} >${from_name ? from_name : ''}</td>`;
        htmlTable += `<td style=${style} >${to_name ? to_name : ''}</td>`;
        htmlTable += `<td style=${style} >${amount}</td>`;
        htmlTable += `</tr>`;
    })
    htmlTable += '</table>';

    return htmlTable;
}

export {formatDataToHTML};