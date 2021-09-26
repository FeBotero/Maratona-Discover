const modal = {
  open() {
    document.querySelector('.modal-overlay')
      .classList.add('active')
  },
  close(){
    document.querySelector('.modal-overlay')
      .classList.remove('active')
  } 
}
const Storage = {//Utilizando o localStorage

  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || 
    []//Transforma em objeto ou array
  },

  set(transactions){
    localStorage.setItem("dev.finances:transactions",
    JSON.stringify(transactions)) //transforma em string as Transactions
  }
}

const modalAccount = {
  open() {
    document.querySelector('.modal-account')
      .classList.add('active')
  },
  close(){
    document.querySelector('.modal-account')
      .classList.remove('active')
  } 
}

const Transaction = {

  all:Storage.get()
  
  
  
  /*[
    {
      id:1,
      description:'luz',
      amount:-50000,
      date:'23/01/2021',
      },
    {
      id:2,
      description:'Criação website',
      amount:500000,
      date:'23/01/2021',
      },
    {
      id:3,
      description:'Internet',
      amount:-20000,
      date:'23/01/2021', 
      }]*/,

  add(operation){
    Transaction.all.push(operation)

    App.reload()
  },

  remove(index){
    Transaction.all.splice(index,1)

    App.reload()
  },

  incomes(){
    let income=0;
    
    Transaction.all.forEach(operation =>{
      if(operation.amount>0){
        income += operation.amount;
      }
    })

    return income;

  },
  expenses(){
    let expense = 0
    Transaction.all.forEach(operation =>{
      if(operation.amount<0){
        expense+=operation.amount;
      }
    })
    return expense
  },
  total(){
    
    return Transaction.incomes() + Transaction.expenses()
  }
  
}

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),


  addTransaction(operations,index){
    
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(operations, index)
    tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr)

  },
  innerHTMLTransaction(operations, index){
    const cssClass = operations.amount>0?"income":"expense"

    const amount = Utils.formatCurrency(operations.amount)

    const html = `
     <td class="description">${operations.description}</td>
     <td class="${cssClass}">${amount}</td>
     <td class="date">${operations.date}</td>
     <td>
        <img onclick="Transaction.remove(${index})" src="/assets/minus.svg" alt="Remover transação">
     </td>
    `

    return html
  },

  updateBalance(){
    document
    .getElementById('incomeDisplay')
    .innerHTML= Utils.formatCurrency(Transaction.incomes())

    document
    .getElementById('expenseDisplay')
    .innerHTML= Utils.formatCurrency(Transaction.expenses())
    
    document
    .getElementById('totalDisplay')
    .innerHTML= Utils.formatCurrency(Transaction.total())
  },
  clearTransactions(){
    DOM.transactionsContainer.innerHTML = " "
  }
}
const App ={

  init(){
    Transaction.all.forEach((DOM.addTransaction)),

    DOM.updateBalance()

    Storage.set(Transaction.all)
  },
  reload(){
    DOM.clearTransactions()
    App.init()
  }
}

const Form ={

  // Associamos uma variavel com campo html
  description: document.querySelector('input#description'),
  amount:document.querySelector('input#amount'),
  date:document.querySelector('input#date'),
  //account:document.querySelector('input#account'),
  //option:document.querySelector('input[name="option"]:checked'),
  

  //Pegando os valores
  getValues(){
    return{
      description:Form.description.value,
      amount:Form.amount.value,
      date:Form.date.value,
      //option:Form.option.value
    }
  },


  validateField(){//Validador de dados
    const{description,amount,date} = Form.getValues()

    if(description.trim() ===""||
    amount.trim()===""||
    date.trim()===""){//||option.trim() ===""
      throw new Error("Por favor, preencha todos os campos.")
      
    }
  },
  


  formatValues(){
    let {description,amount,date,} = Form.getValues()
    amount =Utils.formatAmount(amount)

    date =Utils.formatDate(date)
    
    return{
      description,
      amount,
      date,
      
    }
  },
  
  clearFields(){
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
    //Form.option.value = ""
    //Form.description.value = ""
  },


  submit(event){
    event.preventDefault();

    try{
      //Verificar se as informações do formulario foram preenchidas
      Form.validateField()

      //Selecionar despesa ou receita
      

      //Formatar dados para salvar
      const transaction = Form.formatValues()
  
      //Salvar
      Transaction.add(transaction)

      //Apagar dados do formulario para proxima transação
      Form.clearFields()

      //Modal fechar
      modal.close()

      //Atualizar a aplicação para vermos as transações.Não tem necessidade pq o Add já tem a função de atualizar
      

    }catch(error){
      alert(error.message)
    }

    
  }
}

const Utils = {
  formatAmount(value){
    value = Number(value)*100
    
    return value
  },
  formatDate(date){
    const splittedDate = date.split("-")
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`

  },

  formatCurrency(value){//preciso rever pois não vai ser digitado simbolo de negativo no app
   
    const signal = value <0 ? "-": ""//utilizar depois o input radio para podermos ter o sinal da operação
    
    value = String(value).replace(/\D/g,"")

    value = Number(value)/100

    value = value.toLocaleString("pt-BR",{
      style:"currency",
      currency:"BRL"
    })


    return signal + value 
    //poderia colocar o sinal antes do valor
}
}


App.init()


//