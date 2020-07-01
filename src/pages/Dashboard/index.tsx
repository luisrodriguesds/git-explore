import React, { useState, FormEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.svg'
import { Title, Form, Repositories, Error } from './styles';
import { FiChevronRight } from 'react-icons/fi'

import api from '../../services/api';

interface Repository{
  full_name: string
  description: string
  owner: {
    login: string
    avatar_url: string
  }
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('')
  const [inputError, setInputError] = useState('')
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storageRepo = localStorage.getItem('@GithubExplore:repos')
    if (storageRepo) {
      return JSON.parse(storageRepo)
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem('@GithubExplore:repos', JSON.stringify(repositories))
  }, [repositories])

  async function handleAddRepository(e: FormEvent<HTMLFormElement>): Promise<void>{
    e.preventDefault()
    if(!newRepo){
      setInputError('Digite o autor/nome do repositório')
      return
    }
    
    try {
      const res = await api.get(`/repos/${newRepo}`)
      console.log(res.data);
      setRepositories([...repositories, res.data])
      setNewRepo('')
      setInputError('')
    } catch (error) {
      setInputError('Repositório não encontrado')
    }
  }

  return (
  <>
    <img src={logoImg} alt="logo" />
    <Title>Explore Repositórios no Github</Title>

    <Form hasError={!!inputError} action="" onSubmit={handleAddRepository}>
      <input type="text" value={newRepo} onChange={(e) => setNewRepo(e.target.value)} placeholder="Digite o nome do Repositórios" />
      <button type="submit">Pesquisar</button>
    </Form>

    {inputError && <Error>{inputError}</Error>}
    <Repositories>
      {repositories.map(repository => (
        <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
        <img src={repository.owner.avatar_url} alt={repository.owner.login} />
        <div>
          <strong>{repository.full_name}</strong>
          <p>{repository.description}</p>
        </div>

        <FiChevronRight size={20} />
      </Link>
      ))}
    </Repositories>
  </>
  );
}

export default Dashboard;