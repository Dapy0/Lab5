document.addEventListener("DOMContentLoaded", function () {
  fetch('dane.xml')
    .then(r => r.text())
    .then(xmlStr => {
      const doc = (new DOMParser()).parseFromString(xmlStr, "text/xml");
      fillInvoice(doc);
    });
});

function fillInvoice(xmlDoc) {

  function getVal(tag) {
    const node = xmlDoc.querySelector(tag);
    return node.textContent;
  }

  function getHtmlVal(tag) {
    const node = xmlDoc.querySelector(tag);
    return node.innerHTML;
  }

  const issueData = getVal('miejsce_data').split(', ');
  document.querySelector('.issuePlace').innerText = issueData[0] ;
  document.querySelector('.issueDate').innerText = issueData[1] ;

  document.querySelector('.invoiceNumber').innerText = getVal('numer');
  document.querySelector('.saleDate').innerText = getVal('data_dostawy');
  document.querySelector('.paymentMethod').innerText = getVal('forma_platnosci');
  document.querySelector('.paymentDue').innerText = getVal('termin_platnosci');
  document.querySelector('.bankAccount').innerText = getVal('numer_konta');

  const sellerName = getVal('sprzedawca nazwa');
  const sellerAddress = getHtmlVal('sprzedawca adres');
  document.querySelector('.sellerName').innerHTML = sellerName;
  document.querySelector('.sellerAddress').innerHTML = sellerAddress;

  const buyerName = getVal('nabywca nazwa');
  const buyerAddress = getHtmlVal('nabywca adres');
  document.querySelector('.buyerName').innerHTML = buyerName;
  document.querySelector('.buyerAddress').innerHTML = buyerAddress;

  const container = document.querySelector('.itemContainer');
  const items = xmlDoc.querySelectorAll('pozycja');
  let sumNetto = 0;
  let rowsHtml = [];

  items.forEach((item, index) => {

    const name = item.querySelector('nazwa').textContent;
    const pkwiu = item.querySelector('pkwiu').textContent;
    const jm = item.querySelector('jm').textContent;
    const quantity = parseFloat(item.querySelector('ilosc').textContent);
    const netPrice = parseFloat(item.querySelector('cena_netto').textContent);

    const netValue = quantity * netPrice;
    sumNetto += netValue;

    const row = `
      <div class="itemRow">
          <div class="itemName">${name}</div>
          <div class="itemPKWiU">${pkwiu}</div>
          <div class="itemJM">${jm}</div>
          <div class="itemQuantity">${quantity}</div> 
          <div class="itemNetPrice">${netPrice.toFixed(2)}</div> 
          <div class="itemNetValue">${netValue.toFixed(2)}</div>
      </div>
    `;
    rowsHtml.push(row);

  });

  container.innerHTML = rowsHtml.join('');

  document.querySelector('.totalNetto').innerText = sumNetto.toFixed(2);
  document.querySelector('.totalDue').innerText = sumNetto.toFixed(2) + " PLN";
  document.querySelector('.totalRemaining').innerText = sumNetto.toFixed(2) + " PLN";
}