class Despesa{
    constructor(ano,mes,dia,tipo,descricao,valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    //Validação de dados

    validarDados(){
        //percorrendo os atributos da despesa
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false
            }
        }
        return true

    }
}

class Bd{
    constructor(){
        //verificando se existe id
        let id = localStorage.getItem('id')

        if( id === null){
            localStorage.setItem('id',0)
        }
    }

    //gravar como Indice
    getProximoId(){
        let proximoID = localStorage.getItem('id')
        return parseInt(proximoID) + 1
    }
    //Local Storage
    gravar(d){
        //atualizando o valor

        let id = this.getProximoId()
        
        localStorage.setItem(id, JSON.stringify(d)) // JSON.stringify() -> Converte para Notação JSOn
    
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(){
        
        //array de despesas

        let despesas = Array()
        
        let id = localStorage.getItem('id')

        //Recuperar todas as dispesas cadastradas em localStorage
        for( let i = 1; i <= id; i++){
            //Recuperar as despesas
            let despesa = JSON.parse(localStorage.getItem(i)) // JSON.parse() -> Converte para Notação objeto literal

            //verificar se existe itens q foram pulados ou removios

            if(despesa === null){
                continue
            }

            despesa.id = i 
            despesas.push(despesa)

        }

        return despesas
    }

    pesquisar(despesa){
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()

        console.log(despesasFiltradas)

        //Filtro
        if(despesa.ano != ''){
            console.log("Filtro de ano")
            despesasFiltradas = despesasFiltradas.filter(d => d.ano === despesa.ano)
        }

        if(despesa.mes != ''){
            console.log("Filtro de mes")
            despesasFiltradas = despesasFiltradas.filter(d => d.mes === despesa.mes)
        }

        if(despesa.dia != ''){
            console.log("Filtro de dia")
            despesasFiltradas = despesasFiltradas.filter(d => d.dia === despesa.dia)
        }

        if(despesa.tipo != ''){
            console.log("Filtro de tipo")
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo === despesa.tipo)
        }

        if(despesa.descricao != ''){
            console.log("Filtro de descricao")
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao === despesa.descricao)
        }

        
        if(despesa.valor != ''){
            console.log("Filtro de valor")
            despesasFiltradas = despesasFiltradas.filter(d => d.valor === despesa.valor)
        }

        return despesasFiltradas 
    }

	remover(id){
		localStorage.removeItem(id)
	}
}
 
let bd = new Bd() 

 function cadastrarDespesas(){
    //Recuperando valores dos campos

   let ano = document.getElementById('ano')
   let mes = document.getElementById('mes')
   let dia = document.getElementById('dia')
   let tipo = document.getElementById('tipo')
   let descricao = document.getElementById('descricao')
   let valor = document.getElementById('valor')

   //console.log (ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

   let despesa = new Despesa( 
    ano.value, 
    mes.value, 
    dia.value, 
    tipo.value, 
    descricao.value, 
    valor.value 
   )

   if(despesa.validarDados()){
        bd.gravar(despesa)
        //console.log("Dados Validos ")
        
        //Modal
        document.getElementById('modal_title').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('modal_titulo_div').className = 'modal-header text-sucess'
        document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso'
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className = 'btn btn-success'
       //comando jquary
       $('#modalRegistraDespesa').modal('show')

       ano.value = ''
       mes.value = ''
       dia.value = ''
       tipo.value = ''
       descricao.value = ''
       valor.value = ''
   }else{
       //console.log("Dados Invalidos ")

       //modal
       document.getElementById('modal_title').innerHTML = 'Erro na inclusão do registro'
       document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
       document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação! Verifique se todos os campos foram preenchidos corretamente'
       document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir' 
       document.getElementById('modal_btn').className = 'btn btn-danger'

       //comando jquary
       $('#modalRegistraDespesa').modal('show')

   }
   
}

// Listar Despesas

function carregaListaDespesas(despesas = Array(), filtro = false){

    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros()
    }

   

    //selecionando os elementos tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    //percorrer  array despesas, listando cada despesas de forma dinamica
    despesas.forEach(function(d){
        
        //Criar a linha tr  
        let linha = listaDespesas.insertRow() // insertRow -> permite inserção de linhas 

        //Criar a coluna td

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`// insertCell -> crima coluna, passando parametro

        //ajustar o tipo

        switch(d.tipo){
            case '1': d.tipo  = 'Alimentação'
            break
            case '2': d.tipo  = 'Educação'
            break
            case '3': d.tipo  = 'Lazer'
            break
            case '4': d.tipo  = 'Saúde'
            break
            case '5': d.tipo  = 'Transporte'
            break
        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2). innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //botao excluir despesas 

        let btn = document.createElement('button')
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fa fa-times"  ></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function(){ //remover despesas
			let id = this.id.replace('id_despesa_','')
			//alert(id)
			bd.remover(id)
			window.location.reload()
		}
		linha.insertCell(4).append(btn)
    })

}

// Pesquisar Despesas

function pesquisarDespesa(){
   let ano = document.getElementById('ano').value
   let mes = document.getElementById('mes').value
   let dia = document.getElementById('dia').value
   let tipo = document.getElementById('tipo').value
   let descricao = document.getElementById('descricao').value
   let valor = document.getElementById('valor').value


   let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

   //console.log(despesa)

   let despesas = bd.pesquisar(despesa)

   this.carregaListaDespesas(despesas, true)



}








