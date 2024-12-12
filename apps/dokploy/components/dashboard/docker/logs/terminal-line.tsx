import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { escapeRegExp } from "lodash";
import React from "react";
import { type LogLine, getLogType } from "./utils";

interface LogLineProps {
	log: LogLine;
	searchTerm?: string;
}

export function TerminalLine({ log, searchTerm }: LogLineProps) {
	const { timestamp, message, rawTimestamp } = log;
	const { type, variant, color } = getLogType(message);

	const formattedTime = timestamp
		? timestamp.toLocaleString([], {
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				year: "2-digit",
				second: "2-digit",
			})
		: "--- No time found ---";

	const highlightMessage = (text: string, term: string) => {
		if (!term) return text;

		const parts = text.split(new RegExp(`(${escapeRegExp(term)})`, "gi"));
		return parts.map((part, index) =>
			part.toLowerCase() === term.toLowerCase() ? (
				<span key={index} className="bg-yellow-200 dark:bg-yellow-900">
					{part}
				</span>
			) : (
				part
			),
		);
	};

	const tooltip = (color: string, timestamp: string) => {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div
							className={cn("w-2 h-full flex-shrink-0 rounded-[3px]", color)}
						/>
					</TooltipTrigger>
					<TooltipContent>
						<p className="text text-xs text-muted-foreground break-all max-w-md">
							{timestamp}
						</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	};

	return (
		<div
			className={cn(
				"font-mono text-xs flex flex-row gap-3 py-2 sm:py-0.5 group",
				type === "error"
					? "bg-red-500/10 hover:bg-red-500/15"
					: type === "warning"
						? "bg-yellow-500/10 hover:bg-yellow-500/15"
						: "hover:bg-gray-200/50 dark:hover:bg-gray-800/50",
			)}
		>
			{" "}
			<div className="flex items-start gap-x-2">
				{/* Icon to expand the log item maybe implement a colapsible later */}
				{/* <Square className="size-4 text-muted-foreground opacity-0 group-hover/logitem:opacity-100 transition-opacity" /> */}
				{rawTimestamp && tooltip(color, rawTimestamp)}
				<span className="select-none pl-2 text-muted-foreground w-full sm:w-40 flex-shrink-0">
					{formattedTime}
				</span>
				<Badge
					variant={variant}
					className="w-14 justify-center text-[10px] px-1 py-0"
				>
					{type}
				</Badge>
			</div>
			<span className="dark:text-gray-200 text-foreground ">
				{searchTerm ? highlightMessage(message, searchTerm) : message}
			</span>
		</div>
	);
}
