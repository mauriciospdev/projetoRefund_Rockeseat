//Seleciona os elementos do formulário.
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

//Seleciona os elementos da lista.
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside heade p span")
const expensesTotal = document.querySelector("aside header h2")

// Captura o evento de input para formatar o valor.
amount.oninput = () => {
    // Obtem o valor atual do input e remove os caracteres não númericos.
    let value = amount.value.replace(/\D/g, "")

    //Transformar o valor em centavos.
    value = Number(value) / 100
   
    // Atualiza o valor do input.
    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value){
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })
    
    return value
}

//Captura o evento de submit do formulário para obter os valores.
form.onsubmit = (event) => {
    event.preventDefault()

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

    expenseAdd(newExpense)
}

//Adicionar um novo item a lista.
function expenseAdd(newExpense){
    try {
        //Cria o elemento para adicionar o item (li) na lista (ul).
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        //Cria o ícone da categoria.
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        //Cria a informação de despesa.
        const expenseInfo = document.createElement("dic")
        expenseInfo.classList.add("expense-info")

        //Cria o nome da despesa.
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        //Cria a categoria da despesa.
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        //Adiciona name e category na div das informações da despesa.
        expenseInfo.append(expenseName, expenseCategory)

        //Criar o valor da despesa.
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
            .toUpperCase()
            .replace("R$","")}`

        //Cria o ícone de remover
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remover")

        //Adicionar as informações no item.
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        //Adiciona o item na lista.
        expenseList.append(expenseItem)

        formClear()

        //Atualiza os totais.
        updateTotals()
    } catch (error) {
        alert("Não foi possivel atualizar a lista de despesas")
        console.log(error)
    }
}

//Atualizar os totais.
function updateTotals(){
    try {
        const items = expenseList.children
        
        //Atualiza a quantidade de itens da lista.
        expensesQuantity.textContent = `${items.lenght} ${
            items.lenght > 1 ? "despesas" : "despesa"
        }`

        //Variável para incrementar o total.
        let total = 0


        //Percore cada item (li) da lista (lu).
        for(let item = 0; item < items.lenght; item++){
            const itemAmount = items[item].querySelector(".expense-amount")

            //Remover caracteres não numéricos e substitui a vírgula pelo ponto.
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")

            //Converte o valor para float.
            value = parseFloat(value)

            //Verifica se é um número valido.
            if (isNaN(value)) {
                return alert(
                    "Não foi possível calcular o total. O valor não parecee ser um número."
                )
            }   

            //Incrementar o valor total
            total += Number(value)
        }

        //Cria a span para adicionar o R$ Formatado.
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        //Formata o valor e remove o R$.
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        //Limpa o conteúdo do elemento.
        expensesTotal.innerHTML = ""

        //Adiciona o símbulo da moeda e o valor.
        expensesTotal.append(symbolBRL, total)
    } catch (error) {
        console.log(error)
        alert("Não foi possivel valorizar os totais.")
    }
}

//Criar o método que captura clique de remover.

expenseList.addEventListener("click", function (event){
    if (event.target.classList.contains("remove-icon")) {
        const item = event.target.closest(".expense")
        item.remove()
    }
    updateTotals()
})


function formClear(){
    expense.value = ""
    category.value = ""
    amount.value = ""
}
