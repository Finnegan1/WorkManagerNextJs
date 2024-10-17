"use client"

import React from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "lucide-react"
import { deleteArea } from "./actions"


export function DeleteAlertDialog({ areaId }: { areaId: number }) {

  return (
    <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Löschen</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
              <AlertDialogDescription>
                Diese Aktion kann nicht rückgängig gemacht werden. Der Arbeitsbereich wird dauerhaft gelöscht und alle zugehörigen Daten werden entfernt.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="hover:bg-secondary">Abbrechen</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-secondary" onClick={() => deleteArea(areaId)}>
                <TrashIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                Löschen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
  )
}
