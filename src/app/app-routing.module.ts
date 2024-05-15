import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthenticatedGuard } from './services/auth-gaurd-service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'category/:id',
    loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
    canActivate:[AuthenticatedGuard]
  },
  {
    path: 'subcategory/:id',
    loadChildren: () => import('./sub-category/sub-category.module').then(m => m.SubCategoryModule),
    canActivate:[AuthenticatedGuard]
  },
  {
    path: 'troubleshoot/:id',
    loadChildren: () => import('./troubleshoot/troubleshoot.module').then(m => m.TroubleshootModule),
    canActivate:[AuthenticatedGuard]
  },
  {
    path: 'problem/:id',
    loadChildren: () => import('./problem/problem.module').then(m => m.ProblemModule),
    canActivate:[AuthenticatedGuard]
  },
  {
    path: 'forgotPassword',
    loadChildren: () => import('./forgot-link-page/forgot-link-page.module').then(m => m.ForgotLinkPageModule),
  },
  {
    path: 'chatbot',
    loadChildren: () => import('./chatbot/chatbot.module').then(m => m.ChatbotModule),
    canActivate:[AuthenticatedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
