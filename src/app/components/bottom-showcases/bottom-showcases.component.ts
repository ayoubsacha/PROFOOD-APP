import { Component } from '@angular/core';

interface ProfessionalCard {
  name: string;
  activity: string;
  phone: string;
  email: string;
  logo: string;
  logoType?: 'brand' | 'enterprise';
}

@Component({
  selector: 'app-bottom-showcases',
  templateUrl: './bottom-showcases.component.html',
  styleUrl: './bottom-showcases.component.scss',
})
export class BottomShowcasesComponent {
  protected readonly professionals: ProfessionalCard[] = [
    {
      name: 'Adidas',
      activity: 'Achat groupé - Électronique',
      phone: '(025)655565457',
      email: 'acteurpro4@gmail.com',
      logo: 'A',
    },
    {
      name: 'Newbalance',
      activity: 'Vente de biens résidentiels',
      phone: '(056)665574544',
      email: 'acteurpro3@gmail.com',
      logo: 'NB',
    },
    {
      name: 'Nike',
      activity: 'Location longue durée',
      phone: '(212)539331708',
      email: 'mcdo@ma.mcd.com',
      logo: 'N',
    },
    {
      name: "L'immobiliere D'entreprise",
      activity: 'Location courte durée / saisonnière',
      phone: '(033)800907546',
      email: 'tngcc_hotel@hilton.com',
      logo: 'IE',
      logoType: 'enterprise',
    },
  ];
}
