import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import logoImg from '../../assets/logo.svg'
import { Header, RepositoryInfo, Issues } from './styles';
import api from '../../services/api';

interface RepositoryParams {
  repository: string
}

interface Repository{
  full_name: string
  description: string
  owner: {
    login: string
    avatar_url: string
  },
  stargazers_count: number
  forks_count: number
  open_issues_count: number
}

interface Issue {
  title: string
  id: number
  user: {
    login: string
  }
  html_url: string
}

const Repositories: React.FC = () => {
  const { params } = useRouteMatch<RepositoryParams>()
  const [repository, setRepository] = useState<Repository | null>(null)
  const [issues, setIssues] = useState<Issue[]>([])

  useEffect(() => {
    async function load(){
      // Sempre que eu precisar efetuar a requisição dupla
      // e uma não depender da outra, então faz-se um array de 
      // Promise para efetuar as duas requisões ao mesmo tempo
      const [repository, issues] = await Promise.all([
        api.get(`repos/${params.repository}`),
        api.get(`repos/${params.repository}/issues`)
      ])
      
      setRepository(repository.data)
      setIssues(issues.data)
    }
    load()
  }, [params.repository]) 
  // eslint-disable-line

  return (
    <>
      <Header>
        <img src={logoImg} alt="GitExplore"/>
        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>
      { repository && (
        <RepositoryInfo>
          <header>
            <img src={repository.owner.avatar_url} alt={repository.owner.login} />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repository.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Issues</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}
      
      <Issues>
        {issues.map(issue => (
          <a key={issue.id} href={issue.html_url} target="_blank" rel="noopener noreferrer">
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>

            <FiChevronRight size={20} />
          </a>
        ))}
      </Issues>
    </>
  );
}

export default Repositories;