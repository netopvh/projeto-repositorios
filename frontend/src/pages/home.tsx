/* eslint-disable react/react-in-jsx-scope */
import { useAppDispatch, useAppSelector } from "@/hooks/hooks"
import { AppDispatch, RootState } from "@/store"
import { clearError, fetchRepositories, Repository, setUsername } from "@/store/slices/github-slice"
import { useEffect } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, Download, Upload } from 'lucide-react'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const dispatch = useAppDispatch<AppDispatch>()
  const { username, repositories, loading, error } = useAppSelector((state: RootState) => state.github)
  const navigate = useNavigate()

  const handleSearch = () => {
    if (username.trim()) {
      if(username !== '') {
        dispatch(fetchRepositories(username))
      } else {
        toast.error('Por favor, insira um nome de usuário.');
        dispatch(clearError())
      }
    }
  }

  const exportToCSV = () => {
    if (repositories.length === 0) return

    const csvContent = [
      ['Proprietário', 'Nome', 'Descrição', 'Estrelas', 'URL'],
      ...repositories.map(repo => [repo.owner, repo.name, repo.description || '', repo.stargazers_count, repo.html_url])
    ].map(e => e.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${username}_repositories.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const goToImport = () => {
    navigate('/import')
  }

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Pesquisa de Repositórios GitHub</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex gap-2 mb-4">
            <Input
              type="text"
              value={username}
              onChange={(e) => dispatch(setUsername(e.target.value))}
              placeholder="Digite o nome de usuário do GitHub"
            />
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Pesquisar'}
            </Button>
          </form>
          {repositories.length === 0 && (
            <Button onClick={goToImport}>
              <Upload className="mr-2 h-4 w-4" /> Importar Repositórios
            </Button>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {repositories.length > 0 && (
            <>
              <ScrollArea className="h-[50vh] rounded-md border p-4">
                <h2 className="text-2xl font-bold mb-2">Repositórios</h2>
                <ul className="space-y-2">
                  {repositories.map((repo: Repository) => (
                    <li key={repo.id} className="border p-2 rounded">
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {repo.name}
                      </a>
                      <p className="text-sm text-gray-600">{repo.description}</p>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
              <div className="flex justify-start mt-4 gap-2">
                <Button onClick={exportToCSV} className="">
                  <Download className="mr-2 h-4 w-4" /> Exportar para CSV
                </Button>
                <Button onClick={goToImport}>
                 <Upload className="mr-2 h-4 w-4" /> Importar Repositórios
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
