import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from './user.service';
import { User, UserPayload, emptyUser } from './user.model';

@Component({ selector: 'app-root', standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule], templateUrl: './app.component.html' })
export class AppComponent implements OnInit {
  private readonly service = inject(UserService);
  private readonly fb = inject(FormBuilder);
  users: User[] = []; filteredUsers: User[] = []; selectedUser: User | null = null;
  search = ''; loading = true; saving = false; error = ''; notice = ''; editing = false;
  form = this.fb.nonNullable.group({ name: ['', Validators.required], username: ['', Validators.required], email: ['', [Validators.required, Validators.email]], phone: [''], website: [''], company: [''], city: [''] });

  ngOnInit(): void { this.loadUsers(); }
  loadUsers(): void { this.loading = true; this.service.getUsers().subscribe({ next: users => { this.users = users; this.applyFilter(); this.loading = false; }, error: () => { this.error = 'Impossible de charger les utilisateurs. Vérifiez votre connexion.'; this.loading = false; } }); }
  applyFilter(): void { const query = this.search.trim().toLowerCase(); this.filteredUsers = this.users.filter(u => !query || `${u.name} ${u.username} ${u.email} ${u.company.name}`.toLowerCase().includes(query)); }
  selectUser(user: User): void { this.selectedUser = user; this.editing = false; this.notice = ''; }
  startCreate(): void { this.selectedUser = null; this.editing = true; const blank = emptyUser(); this.form.reset({ name: blank.name, username: blank.username, email: blank.email, phone: blank.phone, website: blank.website, company: blank.company.name, city: blank.address.city }); }
  startEdit(): void { if (!this.selectedUser) return; const u = this.selectedUser; this.editing = true; this.form.reset({ name: u.name, username: u.username, email: u.email, phone: u.phone, website: u.website, company: u.company.name, city: u.address.city }); }
  cancelEdit(): void { this.editing = false; }
  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true; const value = this.form.getRawValue(); const payload: UserPayload = { ...emptyUser(), name: value.name, username: value.username, email: value.email, phone: value.phone, website: value.website, company: { ...emptyUser().company, name: value.company }, address: { ...emptyUser().address, city: value.city } };
    const request = this.selectedUser ? this.service.updateUser(this.selectedUser.id, payload) : this.service.createUser(payload);
    request.subscribe({ next: user => { if (this.selectedUser) { this.users = this.users.map(u => u.id === user.id ? { ...this.selectedUser!, ...user, address: { ...this.selectedUser!.address, ...user.address }, company: { ...this.selectedUser!.company, ...user.company } } : u); } else { this.users = [{ ...user, address: user.address ?? payload.address, company: user.company ?? payload.company }, ...this.users]; } this.applyFilter(); this.selectedUser = this.users.find(u => u.id === user.id) ?? user; this.editing = false; this.saving = false; this.notice = 'Utilisateur enregistré avec succès.'; }, error: () => { this.error = 'La sauvegarde a échoué.'; this.saving = false; } });
  }
  remove(): void { if (!this.selectedUser || !confirm(`Supprimer ${this.selectedUser.name} ?`)) return; const id = this.selectedUser.id; this.service.deleteUser(id).subscribe({ next: () => { this.users = this.users.filter(u => u.id !== id); this.applyFilter(); this.selectedUser = null; this.notice = 'Utilisateur supprimé.'; }, error: () => this.error = 'La suppression a échoué.' }); }
}
