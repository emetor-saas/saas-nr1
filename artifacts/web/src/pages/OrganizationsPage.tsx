import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Building2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OrganizationsPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [unitOpen, setUnitOpen] = useState(false);
  const [workerOpen, setWorkerOpen] = useState(false);
  const [unitForm, setUnitForm] = useState({ name: "", description: "" });
  const [workerForm, setWorkerForm] = useState({ displayName: "", email: "", unitId: "", role: "" });

  const { data: units = [] } = useQuery<any[]>({
    queryKey: ["units"],
    queryFn: () => apiRequest("GET", "/organizations/units"),
  });

  const { data: workers = [] } = useQuery<any[]>({
    queryKey: ["workers"],
    queryFn: () => apiRequest("GET", "/organizations/workers"),
  });

  const createUnit = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/organizations/units", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["units"] }); setUnitOpen(false); setUnitForm({ name: "", description: "" }); toast({ title: "Unidade criada!" }); },
  });

  const createWorker = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/organizations/workers", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["workers"] }); setWorkerOpen(false); setWorkerForm({ displayName: "", email: "", unitId: "", role: "" }); toast({ title: "Colaborador adicionado!" }); },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Organograma</h1>
        <p className="text-muted-foreground mt-1">Unidades organizacionais e colaboradores</p>
      </div>

      <Tabs defaultValue="units">
        <TabsList>
          <TabsTrigger value="units">Unidades</TabsTrigger>
          <TabsTrigger value="workers">Colaboradores</TabsTrigger>
        </TabsList>

        <TabsContent value="units" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button size="sm" onClick={() => setUnitOpen(true)}><Plus className="h-3 w-3 mr-1" />Nova Unidade</Button>
          </div>
          {units.length === 0 ? (
            <Card className="border-dashed"><CardContent className="py-12 text-center">
              <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Nenhuma unidade criada.</p>
              <Button size="sm" className="mt-4" onClick={() => setUnitOpen(true)}>Criar Unidade</Button>
            </CardContent></Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {units.map((u: any) => (
                <Card key={u.id}>
                  <CardContent className="pt-3 pb-3 px-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{u.name}</span>
                    </div>
                    {u.description && <p className="text-xs text-muted-foreground mt-1">{u.description}</p>}
                    <div className="text-xs text-muted-foreground mt-2">
                      {workers.filter(w => w.unitId === u.id).length} colaboradores
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="workers" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button size="sm" onClick={() => setWorkerOpen(true)} disabled={units.length === 0}><Plus className="h-3 w-3 mr-1" />Novo Colaborador</Button>
          </div>
          {units.length === 0 && (
            <Card className="border-amber-200 bg-amber-50 mb-4">
              <CardContent className="py-3 px-4 text-sm text-amber-800">
                Crie ao menos uma unidade organizacional antes de adicionar colaboradores.
              </CardContent>
            </Card>
          )}
          {workers.length === 0 ? (
            <Card className="border-dashed"><CardContent className="py-12 text-center">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Nenhum colaborador cadastrado.</p>
            </CardContent></Card>
          ) : (
            <div className="space-y-2">
              {workers.map((w: any) => (
                <Card key={w.id}>
                  <CardContent className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-semibold text-primary">{w.displayName[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{w.displayName}</p>
                          <p className="text-xs text-muted-foreground">{w.unitName} {w.role && `· ${w.role}`}</p>
                        </div>
                      </div>
                      <Badge variant={w.status === "active" ? "default" : "outline"} className="text-xs">
                        {w.status === "active" ? "Ativo" : w.status === "inactive" ? "Inativo" : "Licença"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={unitOpen} onOpenChange={setUnitOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova Unidade</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Nome</Label><Input value={unitForm.name} onChange={e => setUnitForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Tecnologia, RH, Vendas..." className="mt-1" /></div>
            <div><Label>Descrição</Label><Input value={unitForm.description} onChange={e => setUnitForm(f => ({ ...f, description: e.target.value }))} className="mt-1" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUnitOpen(false)}>Cancelar</Button>
            <Button onClick={() => createUnit.mutate(unitForm)} disabled={!unitForm.name || createUnit.isPending}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={workerOpen} onOpenChange={setWorkerOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo Colaborador</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Nome</Label><Input value={workerForm.displayName} onChange={e => setWorkerForm(f => ({ ...f, displayName: e.target.value }))} className="mt-1" /></div>
            <div><Label>Email (opcional)</Label><Input value={workerForm.email} onChange={e => setWorkerForm(f => ({ ...f, email: e.target.value }))} className="mt-1" /></div>
            <div>
              <Label>Unidade</Label>
              <Select value={workerForm.unitId} onValueChange={v => setWorkerForm(f => ({ ...f, unitId: v }))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar unidade" /></SelectTrigger>
                <SelectContent>
                  {units.map((u: any) => <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Cargo</Label><Input value={workerForm.role} onChange={e => setWorkerForm(f => ({ ...f, role: e.target.value }))} className="mt-1" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWorkerOpen(false)}>Cancelar</Button>
            <Button onClick={() => createWorker.mutate({ ...workerForm, unitId: parseInt(workerForm.unitId) })} disabled={!workerForm.displayName || !workerForm.unitId || createWorker.isPending}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
