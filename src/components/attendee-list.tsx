import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search } from "lucide-react"
import { IconButton } from "./icon-button"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import 'dayjs/locale/pt-br'
import { Table } from "./table/table"
import { TableHeader } from "./table/table-header"
import { TableCell } from "./table/table-cell"
import { TableRow } from "./table/table-row"
import { ChangeEvent, useEffect, useState } from "react"

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Attendee {
    id: string
    name: string
    email: string
    createdAt: string
    checkedInAt: string | null
}

//URL state

export function AttendeeList() {

    const [search, setSearch] = useState(() => {
        const url = new URL(window.location.toString())

        if(url.searchParams.has('search')){
            return url.searchParams.get('search') ?? ''
        }

        return ''
    })

    const [page, setPage] = useState(() => {
        const url = new URL(window.location.toString())

        if(url.searchParams.has('page')){
            return Number(url.searchParams.get('page'))
        }

        return 1

    })
    const [attendees, setAttendees] = useState<Attendee[]>([])
    const [total, setTotal] = useState(0)

    useEffect(() => {
        const url = new URL('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees?')

        url.searchParams.set('pageIndex', String(page - 1))

        if(search.length > 0){
            url.searchParams.set('query', search)
        }

        fetch(url)
        .then(response => response.json())
        .then(data => {
            setAttendees(data.attendees)
            setTotal(data.total)
        })
    }, [page, search])

    const totalPages = Math.ceil(total / 10)

    const handlersChangeSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(event)
        handlersSetCurrentSearch(event.target.value)
        // setPage(1)
    }

    const handlersSetCurrentPage = (page: number) => {
        const url = new URL(window.location.toString())

        url.searchParams.set('page', String(page))

        window.history.pushState({}, "", url)

        setPage(page)
    }

    const handlersSetCurrentSearch = (search: string) => {
        const url = new URL(window.location.toString())

        url.searchParams.set('search', search)

        window.history.pushState({}, "", url)

        setSearch(search)
    }


    const handlersGoToNextPage = () => {
        handlersSetCurrentPage(page + 1)

    }

    const handlersGoToPreviousPage = () => {
        handlersSetCurrentPage(page - 1)
    }

    const handlersGoToFirstPage = () => {
        handlersSetCurrentPage(1)
    }

    const handlersGoToLastPage = () => {
        handlersSetCurrentPage(totalPages)
    }
    
    return(
        <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
                <h1 className="text-2xl font-bold">Participantes</h1>
                <div className="px-3 w-72 py-1.5 border border-white/10 bg-transparent rounded-lg gap-3 flex">
                    <Search className="size-4 text-emerald-300" />
                    <input onChange={handlersChangeSearchInput} value={search} className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-transparent" type="text" placeholder="Buscar participante..." />
                </div>
            </div>
            <Table>
                <thead>
                    <tr className="border-b border-white/10">
                        <TableHeader style={{ width: 48 }}>
                            <input  className="size-4 bg-black/20 rounded border border-white/10" type="checkbox" name="" id="" />
                        </TableHeader>
                        <TableHeader>Código</TableHeader>
                        <TableHeader>Participante</TableHeader>
                        <TableHeader>Data de Inscrição</TableHeader>
                        <TableHeader>Data do check-in</TableHeader>
                        <TableHeader style={{ width: 64 }}></TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {attendees.map((attendee) => {
                        return(
                            <TableRow key={attendee.id}>
                            <TableCell>
                                <input className="size-4 bg-black/20 rounded border border-white/10" type="checkbox" name="" id="" />
                            </TableCell>
                            <TableCell>{attendee.id}</TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold text-white">{attendee.name}</span>
                                    <span>{attendee.email}</span>
                                </div>
                            </TableCell>
                            <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                            <TableCell>
                                {attendee.checkedInAt === null 
                                ? <span className='text-zinc-400'>Não fez check-in</span>
                                : dayjs().to(attendee.checkedInAt)}
                                </TableCell>
                            <TableCell>
                                <IconButton transparent className="bg-black/20 border border-white/10 rounded-md p-1.5">
                                    <MoreHorizontal className="size-4 "/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                        )
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <TableCell className="text-left" colSpan={3}>Mostrando {attendees.length} de {total}</TableCell>
                        <TableCell className="text-right" colSpan={3}>
                            <div className="inline-flex items-center gap-8">              
                                <span>Página {page} de {totalPages}</span>

                                <div className="flex gap-1.5">
                                    <IconButton onClick={handlersGoToFirstPage} disabled={page === 1}>
                                        <ChevronsLeft className="size-4 "/>
                                    </IconButton>
                                    <IconButton onClick={handlersGoToPreviousPage}  disabled={page === 1}>
                                        <ChevronLeft className="size-4 "/>
                                    </IconButton>
                                    <IconButton onClick={handlersGoToNextPage}  disabled={page === totalPages}>
                                        <ChevronRight className="size-4 "/>
                                    </IconButton>
                                    <IconButton onClick={handlersGoToLastPage}  disabled={page === totalPages}>
                                        <ChevronsRight className="size-4 "/>
                                    </IconButton>
                                </div>
                            </div>

                        </TableCell>
                    </tr>
                </tfoot>
            </Table>
        </div>
    )
}