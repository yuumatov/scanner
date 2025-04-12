"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ExternalLink, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Scan({ scan }) {
  const [expandedScan, setExpandedScan] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedScan(expandedScan === id ? null : id)
  }

  return (
    <div className="container mx-auto space-y-4">
      <ScanItem
        key={scan?.id}
        scan={scan}
        isExpanded={expandedScan === scan?.id}
        onToggle={() => toggleExpand(scan?.id)}
      />
    </div>
  )
}

function ScanItem({ scan }) {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd.MM.yyyy HH:mm:ss")
    } catch (error) {
      console.log(error)
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

  // Get check item styling
  const getCheckItemStyling = (status: string) => {
    if (status === "OK") {
      return {
        textColor: "text-emerald-700 dark:text-emerald-400",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        borderColor: "border-emerald-200 dark:border-emerald-900",
        hoverBg: "hover:bg-emerald-100 dark:hover:bg-emerald-950/50",
        icon: <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />,
        badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400",
      }
    } else {
      return {
        textColor: "text-rose-700 dark:text-rose-400",
        bgColor: "bg-rose-50 dark:bg-rose-950/30",
        borderColor: "border-rose-200 dark:border-rose-900",
        hoverBg: "hover:bg-rose-100 dark:hover:bg-rose-950/50",
        icon: <XCircle className="h-5 w-5 text-rose-500 mt-0.5 flex-shrink-0" />,
        badgeClass: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400",
      }
    }
  }

  const statusBadge = getStatusBadge(scan?.status)
  const scoreStyling = getScoreStyling(scan?.scan_data?.sum_ball_status, scan?.scan_data?.sum_ball_percent)

  return (
    <TooltipProvider>
      <Card className="w-full border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <div className="transition-colors flex items-center">
                  <span>ID: {scan?.id}</span>
                </div>
                <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
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
              <span className={`text-sm ${scoreStyling?.textColor}`}>({scan?.scan_data?.sum_ball_percent}%)</span>
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

            <Separator className="my-3" />
            <div className="pt-1">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-slate-800 dark:text-slate-200">Детали сканирования:</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span>Пройдено</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <span>Не пройдено</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {scan?.scan_data?.output &&
                  scan?.scan_data?.output.map((item, index) => {
                    const styling = getCheckItemStyling(item.status)
                    return (
                      <Accordion type="single" collapsible key={item.key} className="w-full">
                        <AccordionItem
                          value={`item-${index}`}
                          className={`border ${styling.borderColor} rounded-md overflow-hidden`}
                        >
                          <AccordionTrigger
                            className={`px-3 py-3 ${styling.bgColor} hover:no-underline ${styling.hoverBg}`}
                          >
                            <div className="flex items-start gap-2 w-full text-left">
                              {styling.icon}
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <p className={`font-medium ${styling.textColor} pr-2`}>{item.desc}</p>
                                  <Badge className={styling.badgeClass}>{item.ball}</Badge>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                                  {item.long_desc}
                                </p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-3 py-2 bg-white dark:bg-slate-950">
                            {item.link_values.length > 0 ? (
                              <ul className="space-y-2 pl-6">
                                {item.link_values.map((link, linkIndex) => (
                                  <li key={linkIndex} className="flex items-start">
                                    <ExternalLink className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0 text-slate-500" />
                                    <a
                                      href={link.url || link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`${styling.textColor} hover:underline text-sm break-all`}
                                    >
                                      {link.title || link.url || link}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-slate-500 dark:text-slate-400 pl-6">Тест пройден успешно</p>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )
                  })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
