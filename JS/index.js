const select = document.querySelector("select");
const search = document.querySelector(".input");
const rowData = document.getElementById("rowData");
const canvas = document.querySelector("canvas");

const fetchData = async function(){
  const response = await fetch("data.json");
  const data = await response.json();
  const customers = data.customers;
  const transactions = data.transactions;
  customers.forEach(customer => {
    const html = `
                  <option value = ${customer.name}>${customer.name}</option>
    `
    select.insertAdjacentHTML("beforeend", html);

   
  });

  setName(data);


  transactions.forEach(el => {
    let html = "";
    if(select.value.toLowerCase() == "all"){
      html +=`
      <tr>
        <td>${el.customer_id}</td>
        <td>${el.name}</td>
        <td>${el.date}</td>
        <td>${el.amount}</td>
    </tr>
      `  
      canvas.classList.add("d-none");
      
}
rowData.insertAdjacentHTML ("beforeend" , html);
});

  select.addEventListener("change", function(){
    let arr = [];
    let html = "";
    transactions.forEach(el => {
    const data = select.value;
          if(el.name.toLowerCase().includes(data.toLowerCase())){
            html +=`
            <tr>
              <td>${el.customer_id}</td>
              <td>${el.name}</td>
              <td>${el.date}</td>
              <td>${el.amount}</td>
          </tr>
            `  
            arr.push(el);
          }else if(data.toLowerCase() == "all"){
            html +=`
            <tr>
              <td>${el.customer_id}</td>
              <td>${el.name}</td>
              <td>${el.date}</td>
              <td>${el.amount}</td>
          </tr>
            `  
            arr.push(el)
            canvas.classList.add("d-none");
    }
        rowData.innerHTML = html;
        makeChart(arr)
    })
    
      })

      search.addEventListener("input" , function(){
        canvas.classList.add("d-none");
        let html = "";
        transactions.forEach(el => {
        if(String(el.amount).includes(search.value)){
          html +=`
          <tr>
            <td>${el.customer_id}</td>
            <td>${el.name}</td>
            <td>${el.date}</td>
            <td>${el.amount}</td>
        </tr>
          `  
        }
      })
        rowData.innerHTML = html;
      })
  }
fetchData();





const setName = function(data){
  const {customers , transactions} = data;

  customers.forEach(customer => {
    const idCustomer = customer.id;

    transactions.forEach(transaction =>{
      const id = transaction.customer_id;
      if(id === idCustomer){
        transaction.name = customer.name
      }
    })
  })
}


 

function makeChart(arr) {
  let chartCurrent = Chart.getChart("myChart");
  if (chartCurrent != undefined) {
    chartCurrent.destroy();
  }
  const ctx = document.getElementById("myChart");
  document.querySelector("#myChart").innerHTML = " ";
  if(select.value != "All"){
    canvas.classList.remove("d-none");
  }else{
    canvas.classList.add("d-none");
  }

  setTimeout(() => {
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: arr.map((el) => el.date),
        datasets: [
          {
            label: "Amount",
            data: arr.map((el) => el.amount),
            borderWidth: 1,
            backgroundColor: "#F8D7DA",
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, 200);
}