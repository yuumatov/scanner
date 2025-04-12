import { format } from "date-fns"
import {
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ScanItem({ scan }) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd.MM.yyyy HH:mm:ss")
    } catch (error) {
			console.log(error);
      return dateString
    }
  }

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "finished":
        return {
          label: "Завершено",
          className: "bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400",
        }
      case "in_progress":
        return {
          label: "В процессе",
          className: "bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400",
        }
      case "failed":
        return {
          label: "Ошибка",
          className: "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400",
        }
      default:
        return {
          label: status,
          className: "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400",
        }
    }
  }

  // Get score styling
  const getScoreStyling = (status: string, percent: number) => {
    if (status === "FAIL") {
      return {
        textColor: "text-rose-600 dark:text-rose-500",
        bgColor: "bg-rose-100 dark:bg-rose-950/50",
        progressColor: "bg-rose-500",
        progressBg: "bg-rose-100 dark:bg-rose-950/50",
        icon: <XCircle className="h-5 w-5 text-rose-500" />,
      }
    } else if (percent >= 80) {
      return {
        textColor: "text-emerald-600 dark:text-emerald-500",
        bgColor: "bg-emerald-100 dark:bg-emerald-950/50",
        progressColor: "bg-emerald-500",
        progressBg: "bg-emerald-100 dark:bg-emerald-950/50",
        icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
      }
    } else {
      return {
        textColor: "text-amber-600 dark:text-amber-500",
        bgColor: "bg-amber-100 dark:bg-amber-950/50",
        progressColor: "bg-amber-500",
        progressBg: "bg-amber-100 dark:bg-amber-950/50",
        icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      }
    }
  }

  const statusBadge = getStatusBadge(scan?.status)
  const scoreStyling = getScoreStyling(scan?.scan_data?.sum_ball_status, scan?.scan_data?.sum_ball_percent)

  return (
		<Card className="w-full border-slate-200 dark:border-slate-800 shadow-sm">
			<CardHeader className="pb-2">
				<div className="flex justify-between items-start">
					<div>
						<CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
							<Link
								href={`/results/${scan?.id}`}
								className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center"
							>
								<span>ID: {scan?.id}</span>
								<ExternalLink className="h-3.5 w-3.5 ml-1 opacity-70" />
							</Link>
							<Badge className={statusBadge?.className}>{statusBadge?.label}</Badge>
						</CardTitle>
						<CardDescription className="mt-1 flex items-center gap-1 text-slate-500 dark:text-slate-400">
							<ExternalLink className="h-4 w-4" />
							<a href={scan?.input_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
								{scan?.input_url}
							</a>
						</CardDescription>
					</div>
					<div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${scoreStyling.bgColor}`}>
						<span className={`text-lg font-bold ${scoreStyling.textColor}`}>
							{scan?.scan_data?.sum_ball}/{scan?.scan_data?.all_ball}
						</span>
						<span className={`text-sm ${scoreStyling.textColor}`}>({scan?.scan_data?.sum_ball_percent}%)</span>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex flex-col sm:flex-row justify-between text-sm text-slate-500 dark:text-slate-400">
						<div className="flex items-center gap-1">
							<Clock className="h-4 w-4" />
							<span>Начало: {formatDate(scan?.start_date)}</span>
						</div>
						<div className="flex items-center gap-1">
							<Clock className="h-4 w-4" />
							<span>Окончание: {formatDate(scan?.end_date)}</span>
						</div>
					</div>

					<div>
						<div className="flex justify-between mb-1.5">
							<span className="text-sm font-medium text-slate-600 dark:text-slate-300">Результат</span>
							<div className="flex items-center gap-1.5">
								{scoreStyling.icon}
								<span className={`text-sm font-medium ${scoreStyling.textColor}`}>
									{scan?.scan_data?.sum_ball_status === "FAIL" ? "Не пройдено" : "Пройдено"}
								</span>
							</div>
						</div>
						<div className={`w-full h-2 rounded-full ${scoreStyling.progressBg}`}>
							<div
								className={`h-2 rounded-full ${scoreStyling.progressColor}`}
								style={{ width: `${scan?.scan_data?.sum_ball_percent}%` }}
							/>
						</div>
					</div>
				</div>
			</CardContent>
			<CardFooter className="pt-0">
				<div className="flex gap-2 ml-auto">
					<Button variant="outline" size="sm" asChild className="text-slate-600 dark:text-slate-300">
						<a href={`/results/${scan?.id}`}>Открыть детали</a>
					</Button>
				</div>
			</CardFooter>
		</Card>
  )
}