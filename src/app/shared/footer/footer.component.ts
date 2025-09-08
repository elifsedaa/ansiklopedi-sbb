import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  // Ansiklopedi bilgisi
  encyclopediaInfo: string = 'Bilgi İşlem Dairesi Başkanlığı | Yazılım Şube Müdürlüğü Tarafından Geliştirilmiştir.';

  // Diğer platformlar
  platforms: any[] = [
    { name: 'Kurumsal Web Sitesi', url: 'https://www.sakarya.bel.tr' },
    { name: 'Mezarlık Bilgi Sistemi', url: 'https://mezarlik.sakarya.bel.tr' },
    { name: 'Nöbetçi Eczaneler', url: 'https://nobetci.sakarya.bel.tr' }
  ];

  // Sosyal medya linkleri (5 adet görseldekilere uygun)
  sbbSocial: any[] = [
    { name: 'Facebook', icon: 'fab fa-facebook-f', url: 'https://www.facebook.com/sakaryabelediyesi' },
    { name: 'Twitter', icon: 'fab fa-x-twitter', url: 'https://www.twitter.com/sakaryabeltr' },
    { name: 'Google', icon: 'fab fa-google', url: 'https://www.google.com' },
    { name: 'Instagram', icon: 'fab fa-instagram', url: 'https://www.instagram.com/sakaryabelediyesi' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin-in', url: 'https://www.linkedin.com/company/sakaryabelediyesi' }
  ];

  // İletişim bilgileri
  sbbContact: any[] = [
    { icon: 'fas fa-home', text: 'Kavaklar Caddesi No:7 54100 Adapazarı/SAKARYA' },
    { icon: 'fas fa-phone', text: '44 44 054' },
    { icon: 'fas fa-fax', text: '0264 289 30 00' },
    { icon: 'fas fa-envelope', text: 'iletisim@sakarya.bel.tr' }
  ];

  ngOnInit(): void {
    // API'den veri çekme işlemi buraya eklenebilir
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
