class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    validarDados(){
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null) {
                return false;
            } 
        }

        return true;
    }
};

class Bd {
    constructor(){
        let id = localStorage.getItem('id');

        if(id === null){
            localStorage.setItem('id', 0);
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;
    }
    
    gravar(d) {
        let id = this.getProximoId();
        
        localStorage.setItem(id, JSON.stringify(d));

        localStorage.setItem('id', id);
    }

    recuperaTodosRegistros(){
        // Array despesas
        let despesas = []
        
        let id = localStorage.getItem('id');

        for (let i = 1; i <= id; i++) {

            let despesa = JSON.parse(localStorage.getItem(i));

            // Verifica se o item foi removido, caso removido pula para o próximo;
            if (!despesa) {
                continue;
            };

            despesa.id = i;
            despesas.push(despesa);
        };

        return despesas;
        
    }

    pesquisar(despesa){
        
        let filtroDespesas = [];

        filtroDespesas = this.recuperaTodosRegistros();
       
        if(despesa.ano != ''){
            filtroDespesas = filtroDespesas.filter(d => d.ano == despesa.ano);
        }

        if(despesa.mes != ''){
            filtroDespesas = filtroDespesas.filter(d => d.mes == despesa.mes);
        }

        if(despesa.dia != ''){
            filtroDespesas = filtroDespesas.filter(d => d.dia == despesa.dia);
        }

        if(despesa.tipo != ''){
            filtroDespesas = filtroDespesas.filter(d => d.tipo == despesa.tipo);
        }

        if(despesa.descricao != ''){
            filtroDespesas = filtroDespesas.filter(d => d.descricao == despesa.descricao);
        }

        if(despesa.valor != ''){
            filtroDespesas = filtroDespesas.filter(d => d.valor == despesa.valor);
        }

        return filtroDespesas
    };

    remover(id){
        localStorage.removeItem(id);
    };
};

let bd = new Bd()

function cadastrarDespesa(){

    let ano = document.getElementById('ano');
    let mes = document.getElementById('mes');
    let dia = document.getElementById('dia');
    let tipo = document.getElementById('tipo');
    let descricao = document.getElementById('descricao');
    let valor = document.getElementById('valor');

    let tituloModal = document.getElementById('tituloModal');
    let pModal = document.getElementById('pModal');
    let btnModal = document.getElementById('btnModal');
    

    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value);

    if(despesa.validarDados(despesa)){
        bd.gravar(despesa);
        $('#modalRegistroDespesa').modal('show');
        tituloModal.innerHTML = 'Sucesso!';
        tituloModal.classList.remove('text-danger');
        tituloModal.classList.add('text-success');
        pModal.innerText = 'Despesa registrada com sucesso.';
        btnModal.innerText = 'Fechar';
        btnModal.classList.remove('btn-danger');
        btnModal.classList.add('btn-success');

        ano.value = '';
        mes.value = '';
        dia.value = '';
        tipo.value = '';
        descricao.value = '';
        valor.value = '';
    } else {
        $('#modalRegistroDespesa').modal('show');
        tituloModal.innerHTML = 'Erro!';
        tituloModal.classList.remove('text-success');
        tituloModal.classList.add('text-danger');
        pModal.innerText = 'Por favor, preencha todos os campos corretamente.';
        btnModal.innerText = 'Voltar e corrigir';
        btnModal.classList.remove('btn-success');
        btnModal.classList.add('btn-danger');
    }
    
};

function carregaListaDespesas(despesas = Array(), filtro = false){
    
    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperaTodosRegistros();
    }

    let listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';

    despesas.forEach((d) => {
        
        let linha = listaDespesas.insertRow();

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;

        switch (d.tipo){
            case '1': d.tipo = 'Alimentação'
                break;
            case '2': d.tipo = 'Educação'
                break;
            case '3': d.tipo = 'Lazer'
                break;
            case '4': d.tipo = 'Saúde'
                break; 
            case '5': d.tipo = 'Transporte'
                break;
        };
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;

        let btn = document.createElement('button');
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){
            let id = this.id.replace('id_despesa_', '')
            
            bd.remover(id)

            window.location.reload()
        }
        linha.insertCell(4).append(btn);

        console.log(d);
    });

    ano.value = '';
    mes.value = '';
    dia.value = '';
    tipo.value = '';
    descricao.value = '';
    valor.value = '';
    
};

function pesquisarDespesa(){
    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    let despesas = bd.pesquisar(despesa);

    carregaListaDespesas(despesas, true)
    
};