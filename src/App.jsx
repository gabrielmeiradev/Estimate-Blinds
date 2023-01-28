import { useEffect, useState } from 'react'
import { db_tecidos } from './databases/tecidos'
import { db_acessorios } from './databases/acessorios'
import { suportes } from './databases/suportes'
import { entretelas } from './databases/entretelas'
import { ilhoses } from './databases/ilhos'
import { rodizios } from './databases/rodizios'
import { argolas } from './databases/argolas'
import { tubos } from './databases/tubos'
import { trilhos } from './databases/trilhos'
import { ponteiras } from './databases/ponteiras'
import './App.css'

function App() {
  const [altura, setAltura] = useState(0)
  const [largura, setLargura] = useState(0)
  const [quantidade, setQuantidade] = useState(1)

  
  // TODO: Fix this
  const calcularMaoDeObra = () => {
    let multTotal = 0
    for(let tecido in valoresTecidos){
      tecido = valoresTecidos[tecido]
      if(tecido.produto == '') continue
      multTotal += tecido.mult 
    }
    return (multTotal / 1.5) * 30
  }
  
  const [valoresTecidos, setValoresTecidos] = useState({
    forro: {produto: "", valor: 0, mult: 1},
    voal: {produto: "", valor: 0, mult: 1},
    xale: {produto: "", valor: 0, mult: 1},
  })
  
  const [valoresAcessorios, setValoresAcessorios] = useState({
    entretela: {produto: "", valor: 0, mult: 1},
    ilhos: {produto: "", valor: 0, mult: 1},
    rodizio: {produto: "", valor: 0, mult: 1},
    argola: {produto: "", valor: 0, mult: 1},
    varaomedio: {produto: "", valor: 0, mult: 1},
    varaogrosso: {produto: "", valor: 0, mult: 1},
    ponteiramedia: {produto: "", valor: 0, mult: 1},
    ponteiragrossa: {produto: "", valor: 0, mult: 1},
    trilho: {produto: "", valor: 0, mult: 1},
    suporte: {produto: "", valor: 0, mult: 1}
  })

  const alturaHandle = (e) => {
    setAltura(e.target.value)
  }

  const larguraHandle = (e) => {
    setLargura(e.target.value)
  }

  const quantidadeHandle = (e) => {
    setQuantidade(e.target.value)
  }

  const tecidoHandle = (e, tecido) => {
    const produto_nome = e.target.value
    const valor = (db_tecidos[produto_nome]) || 0
    setValoresTecidos({...valoresTecidos, [tecido]: {...valoresTecidos[tecido], produto: produto_nome, valor: valor}})
  }

  const acessorioHandle = (e, acessorio) => {
    const produto_nome = e.target.value
    const valor = (db_acessorios[produto_nome]) || 0
    setValoresAcessorios({...valoresAcessorios, [acessorio]: {...valoresAcessorios[acessorio], produto: produto_nome, valor: valor}})
  }

  const multHandleTecido = (e, tecido) => {
    const mult = Number(e.target.value)
    setValoresTecidos({...valoresTecidos, [tecido]: {...valoresTecidos[tecido], mult: mult}})
  }

  const multHandleAcessorio = (e, acessorio) => {
    const mult = Number(e.target.value)
    setValoresAcessorios({...valoresAcessorios, [acessorio]: {...valoresAcessorios[acessorio], mult: mult}})
  }

  
  function closeTotal(){
    const totalArea = document.querySelector('.total-area')
    totalArea.style.transform = "translateX(100%)"
  }
  
  function getTotal() {
    const totalArea = document.querySelector('.total-area')
    totalArea.style.transform = "translateX(0)"
    // Rules:
    // if entretela || ilhos => valor = mult_xale * valor_acessorio
    // if argola || argola => valor = largura / 0.07 * valor_acessorio
    // Iteration:
    // all values * mult 
    // fita_facil_wave = mult_xale
    let total = 0 

    let mult_xale = valoresTecidos['xale']['mult']
    // Acessórios
    for(let acessorio in valoresAcessorios){
      let acessorioObj = valoresAcessorios[acessorio]

      switch(acessorio){
        case 'entretela':
          total += (acessorioObj.valor * mult_xale) * acessorioObj.mult
          console.log(acessorio, ': ', (acessorioObj.valor * mult_xale) * acessorioObj.mult)
          break
        case 'ilhos':
          total += (mult_xale / 0.14) * acessorioObj.valor 
          console.log(acessorio, ': ',  (mult_xale / 0.14) * acessorioObj.valor)
          break
        case 'argola':
          total += largura/0.05 * acessorioObj.valor
          console.log(acessorio, ': ', largura/0.05 * acessorioObj.valor)
          break
        case 'rodizio':
          total += largura/0.05 * acessorioObj.valor
          console.log(acessorio, ': ',  largura/0.05 * acessorioObj.valor)
          break
        default: 
          total += acessorioObj.valor * acessorioObj.mult
          console.log(acessorio, ': ', acessorioObj.valor * acessorioObj.mult)
          break
      }
    }  
    
    for(let tecido in valoresTecidos){
      tecido = valoresTecidos[tecido]
      total += tecido.valor * tecido.mult
      console.log(tecido, ': ', tecido.valor)
    }
    
    let maoDeObra = calcularMaoDeObra()
    console.log(maoDeObra, ' :mdo')
    total += maoDeObra
    total *= Number(quantidade)
    setTotalGlobal(toReais(total))
    return total
  }
  const toReais = (amount) => {
    return amount.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
  }
  
  const [totalGlobal, setTotalGlobal] = useState("") 

  return (
    <div className='app'>
      <header>
        <img class="logo" src="logo-branco.png" alt="" />
        <h1>Estimate</h1>
      </header>
      <div className="row">
        <div className="input default-input">
          <label>Altura</label>
          <input value={altura} onInput={alturaHandle} type="number"/>
        </div>
        <div className="input default-input">
          <label>Largura</label>
          <input value={largura} onInput={larguraHandle} type="number"/>
        </div>
        <div className="input default-input">
          <label>Quantidade</label>
          <input value={quantidade} onInput={quantidadeHandle} type="number"/>
        </div>
      </div>

      <h2>Tecido</h2>
      
      <div className="row">
        <div className="input-double default-input">
          <div className="input">
            <label>Forro</label>
            <input list='datalistForro' value={valoresTecidos.forro.produto} onChange={(event) => {tecidoHandle(event, 'forro')}} />
            <datalist id="datalistForro">
              { Object.keys(db_tecidos).map((tecido) => {
                return <option key={tecido}>{tecido}</option>
              }) }
            </datalist>
          </div>
          <input type="number" value={valoresTecidos.forro.mult} onChange={(event) => {multHandleTecido(event, 'forro')}} />
        </div>

        <div className="input-double default-input">
          <div className="input">
            <label>Voal</label>
            <input list='datalistVoal' value={valoresTecidos.voal.produto} onChange={(event) => {tecidoHandle(event, 'voal')}}/>
            <datalist id="datalistVoal">
              { Object.keys(db_tecidos).map((tecido) => {
                return <option key={tecido}>{tecido}</option>
              }) }
            </datalist>
          </div>

          <input type="number" value={valoresTecidos.voal.mult} onChange={(event) => {multHandleTecido(event, 'voal')}} />
        </div>
        
        <div className="input-double default-input">
          <div className="input">
            <label>Xale</label>
            <input list='datalistXale' value={valoresTecidos.xale.produto} onChange={(event) => {tecidoHandle(event, 'xale')}}/>
            <datalist id="datalistXale">
              { Object.keys(db_tecidos).map((tecido) => {
                return <option key={tecido}>{tecido}</option>
              }) }
            </datalist>
          </div>

          <input type="number" value={valoresTecidos.xale.mult} onChange={(event) => {multHandleTecido(event, 'xale')}} />
        </div>
      </div>
      
      <h2>Acessórios</h2>

      <div className="row">
        <div className="input default-input">
          <label>Entretela</label>
          <input list='datalistEntretela' value={valoresAcessorios.entretela.produto} onChange={(event) => {acessorioHandle(event, 'entretela')}}/>
          <datalist id="datalistEntretela">
            { Object.keys(entretelas).map((acessorio) => {
              return <option key={acessorio}>{acessorio}</option>
            }) }
          </datalist>
        </div>
        
        <div className="input default-input">
          <label>Ilhós</label>
          <input list='datalistIlhos' value={valoresAcessorios.ilhos.produto} onChange={(event) => {acessorioHandle(event, 'ilhos')}} />
          <datalist id="datalistIlhos">
            { Object.keys(ilhoses).map((acessorio) => {
              return <option key={acessorio}>{acessorio}</option>
            }) }
          </datalist>
        </div>

        <div className="input default-input">
          <label>Rodízio</label>
          <input list='datalistRodizio' value={valoresAcessorios.rodizio.produto} onChange={(event) => {acessorioHandle(event, 'rodizio')}} />
          <datalist id="datalistRodizio">
            { Object.keys(rodizios).map((acessorio) => {
              return <option key={acessorio}>{acessorio}</option>
            }) }
          </datalist>
        </div>
      </div>
      
      <div className="row">
        <div className="input default-input">
          <label>Argola</label>
          <input list='datalistArgola' value={valoresAcessorios.argola.produto} onChange={(event) => {acessorioHandle(event, 'argola')}}/>
          <datalist id="datalistArgola">
            { Object.keys(argolas).map((acessorio) => {
              return <option key={acessorio}>{acessorio}</option>
            }) }
          </datalist>
        </div>
        
        <div className="input-double default-input">
          <div className="input default-input">
            <label>Varão Grosso</label>
            <input list='datalistVaraoGrosso' value={valoresAcessorios.varaogrosso.produto} onChange={(event) => {acessorioHandle(event, 'varaogrosso')}}/>
            <datalist id="datalistVaraoGrosso">
              { Object.keys(tubos).map((acessorio) => {
                return <option key={acessorio}>{acessorio}</option>
              }) }
            </datalist>
          </div>
          <input type="number" value={valoresAcessorios.varaogrosso.mult} onChange={(event) => {multHandleAcessorio(event, 'varaogrosso')}} />
        </div>

        <div className="input-double default-input">
          <div className="input">
            <label>Varão médio</label>

            <input list='datalistVaraoMedio' value={valoresAcessorios.varaomedio.produto} onChange={(event) => {acessorioHandle(event, 'varaomedio')}}/>
            <datalist id="datalistVaraoMedio">
              { Object.keys(tubos).map((acessorio) => {
                return <option key={acessorio}>{acessorio}</option>
              }) }
            </datalist>
          </div>
          <input type="number" value={valoresAcessorios.varaomedio.mult} onChange={(event) => {multHandleAcessorio(event, 'varaomedio')}} />
        </div>
      </div>
      
      <div className="row">
        <div className="input-double default-input">
          <div className="input">
            <label>Trilho</label>
            <input list='datalistTrilho' value={valoresAcessorios.trilho.produto} onChange={(event) => {acessorioHandle(event, 'trilho')}}/>
            <datalist id="datalistTrilho">
              { Object.keys(trilhos).map((acessorio) => {
                return <option key={acessorio}>{acessorio}</option>
              }) }
            </datalist>
          </div>
          <input type="number" value={valoresAcessorios.trilho.mult} onChange={(event) => {multHandleAcessorio(event, 'trilho')}} />
        </div>

        <div className="input-double default-input">
          <div className="input">
            <label>Suporte</label>
            <input list='datalistSuporte' value={valoresAcessorios.suporte.produto} onChange={(event) => {acessorioHandle(event, 'suporte')}} />
            <datalist id="datalistSuporte">
              { Object.keys(suportes).map((acessorio) => {
                return <option key={acessorio}>{acessorio}</option>
              }) }
            </datalist>
          </div>
          <input type="number" value={valoresAcessorios.suporte.mult} onChange={(event) => {multHandleAcessorio(event, 'suporte')}} />
        </div>

        <div className="input-double default-input">
          <div className="input">
            <label>Ponteira média</label>
            <input list='datalistPonteiraMedia' value={valoresAcessorios.ponteiramedia.produto} onChange={(event) => {acessorioHandle(event, 'ponteiramedia')}}/>
            <datalist id="datalistPonteiraMedia">
              { Object.keys(ponteiras).map((acessorio) => {
                return <option key={acessorio}>{acessorio}</option>
              }) }
            </datalist>
          </div>
          <input type="number" value={valoresAcessorios.ponteiramedia.mult} onChange={(event) => {multHandleAcessorio(event, 'ponteiramedia')}} />
        </div>
      </div>
      <div className="row">
        <div className="input-double default-input">
          <div className="input">
            <label>Ponteira grossa</label>
            <input list='datalistPonteiraGrossa' value={valoresAcessorios.ponteiragrossa.produto} onChange={(event) => {acessorioHandle(event, 'ponteiragrossa')}}/>
            <datalist id="datalistPonteiraGrossa">
              { Object.keys(ponteiras).map((acessorio) => {
                return <option key={acessorio}>{acessorio}</option>
              }) }
            </datalist>
          </div>
          <input type="number" value={valoresAcessorios.ponteiragrossa.mult} onChange={(event) => {multHandleAcessorio(event, 'ponteiragrossa')}} />
        </div>
      </div>
      <div className="button-container">
        <button onClick={getTotal} className="button_calcular">Calcular</button>
      </div>
      <div className='total-area'>
        <span className="close-button" onClick={closeTotal}>x</span>
        <p>Total:</p>
        <h2>{totalGlobal}</h2>
      </div>
    </div>
  )
}

export default App
