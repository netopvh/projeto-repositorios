/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { AppDispatch, RootState } from "@/store";
import { fetchPersistedRepositories, persistImportedRepositories } from "@/store/slices/github-slice";

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, Upload, RefreshCw, Download, Search } from 'lucide-react'
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as io from "socket.io-client";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";

export default function Import() {
    const socketIORef = useRef<SocketIOClient.Socket | null>(null);
    const dispatch = useAppDispatch<AppDispatch>()
    const { importedRepositories, loading, error } = useAppSelector((state: RootState) => state.github)
    const navigate = useNavigate()
    const [filterText, setFilterText] = useState('')

    useEffect(() => {
        socketIORef.current = io.connect('http://localhost:3002')
        socketIORef.current.on('connect', () => {
          console.log('Connected to Socket.IO server')
        })
        socketIORef.current.on('message', (data: any) => {
            if(data === 'completed'){
                dispatch(fetchPersistedRepositories())
                toast.success('Importação concluida com sucesso!')
            }
        })
      }, [])

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
          dispatch(persistImportedRepositories(file)).then(() => {
                event.target.value = '';
            });
        }
    }

    const handleRefresh = () => {
        dispatch(fetchPersistedRepositories())
    }

    const handleGoToExport = () => {
        navigate('/')
    }

    useEffect(() => {
        dispatch(fetchPersistedRepositories())
    }, [dispatch])

    const filteredRepositories = Array.isArray(importedRepositories)
    ? importedRepositories.filter(repo =>
        repo.name.toLowerCase().includes(filterText.toLowerCase()) ||
        repo.owner.toLowerCase().includes(filterText.toLowerCase())
      )
    : []

    return (
        <div className="container max-w-4xl mx-auto p-4">
            <Card className="w-full">
            <CardHeader>
                <CardTitle>Importação e Visualização de Repositórios</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 mb-4">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleImport}
                        style={{ display: 'none' }}
                        id="import-file"
                    />
                    <Button asChild>
                        <label htmlFor="import-file" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                            Importar Repositórios
                        </label>
                    </Button>
                    <Button onClick={handleRefresh}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Atualizar Lista
                    </Button>
                    <Button onClick={handleGoToExport}>
                        <Download className="mr-2 h-4 w-4" /> 
                     Exportar para CSV
                    </Button>
                </div>
        
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        
                {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                )}
        
                {Array.isArray(importedRepositories) && importedRepositories.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Filtrar repositórios..."
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            className="max-w-sm"
                        />
                        </div>
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Nome do Repositório</TableHead>
                                <TableHead>Proprietário</TableHead>
                                <TableHead>Estrelas</TableHead>
                                <TableHead>URL</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {filteredRepositories.map((repo) => (
                                <TableRow key={repo.id}>
                                <TableCell>{repo.name}</TableCell>
                                <TableCell>{repo.owner}</TableCell>
                                <TableCell>{repo.stars}</TableCell>
                                <TableCell>{repo.url}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        {filteredRepositories.length === 0 && (
                            <p className="text-center text-gray-500">Nenhum repositório encontrado com o filtro atual.</p>
                        )}
                    </div>
                )}
            </CardContent>
            </Card>
        </div>
    )
}