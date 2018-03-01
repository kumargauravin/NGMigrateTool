import { HomeComponent } from './components/home/home.component';
import { CompareListComponent } from './components/compare-list/compare-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListViewComponent } from './list-view/list-view.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'compareList',
        component: CompareListComponent
    },
    {
        path: 'listView',
        component: ListViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
