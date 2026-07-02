'use client'

import * as React from 'react'
import { Globe, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LANGUAGES } from '@/lib/i18n'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = React.useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Select language"
          className="relative h-9 w-9"
        >
          <Globe className="h-[1.15rem] w-[1.15rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Select Language
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {LANGUAGES.map((l) => (
            <DropdownMenuItem
              key={l.code}
              onSelect={() => setLang(l.code)}
              className="flex items-center justify-between gap-3 cursor-pointer"
            >
              <span className="flex flex-col">
                <span className="text-sm">{l.nativeName}</span>
                <span className="text-[0.7rem] text-muted-foreground">
                  {l.name}
                </span>
              </span>
              {lang === l.code && (
                <Check className={cn('h-4 w-4 text-primary')} />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
