import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'

export default class App extends Component {
  constructor() {
    super()

    this.state = {
      io: socketIOClient('http://192.168.0.25:3333'),
      mensagens: [],
      novaMensagem: '',
      sala: false,
    }

    this.ouvirMensagens()
  }

  enviarMensagem = () => {
    const { novaMensagem, io } = this.state
    
    this.setState({ mensagens: [...this.state.mensagens, novaMensagem] })

    io.emit('novaMensagem', novaMensagem)

    this.setState({ novaMensagem: '' })
  }

  enviarMensagemSala = () => {
    const { novaMensagem, io } = this.state

    io.emit('novaMensagemSala', novaMensagem)

    this.setState({ novaMensagem: '' })
  }

  ouvirMensagens = () => {
    const { io } = this.state

    io.on('mensagens', novaMensagem => {
      this.setState({ mensagens: [...this.state.mensagens, novaMensagem] })
    })

    io.on('sala', () => {
      this.setState({ sala: !this.state.sala })
    })
  }

  render() {
    const { mensagens, novaMensagem, io, sala } = this.state

    return (
      <>
        {!sala && (
          <button onClick={() => io.emit('entrarSala', '1107')}>
            Entrar na sala
          </button>
        )}

        {sala && (
          <button onClick={() => io.emit('sairSala', '1107')}>
            Sair da sala
          </button>
        )}

        <ul>
          {mensagens.map((mensagem, index) => (
            <li key={index}>{mensagem}</li>
          ))}
        </ul>

        <input
          autoFocus
          value={novaMensagem}
          onChange={e => this.setState({ novaMensagem: e.target.value })}
        />

        <br /><br />

        <button onClick={this.enviarMensagem}>
          Enviar
        </button>

        <button onClick={this.enviarMensagemSala}>
          Enviar para sala
        </button>
        
      </>
    )
  }
}