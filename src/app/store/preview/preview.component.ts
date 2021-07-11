import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from 'src/app/services/entities';
import { colors } from 'src/app/theme/themes';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  store: Store;
  homePage: any;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.store = JSON.parse(localStorage['preview']);
    if (!this.store) {
      this.router.navigate([ 'loja' ])
    } else {
      this.setColor(this.store.color);
      this.setPages();
    }
  }

  setPages() {
    this.homePage = 
    `<html>
      <body>
        <div class="mobile">
          <section class="jumbotron">
            <img src="${this.store.logo}" class="rounded-circle" alt="Logotipo da Empresa">
            <div class="logo-and-number">
              <h1>${this.store.title}</h1>
              <a href="tel:+55${this.store.phone}">
                <i-phone class="fill"></i-phone> ${this.store.phone}
              </a>
            </div>
          </section>
          <p class="text-center text-theme">${this.store.slogan}</p>
          <section class="actions sticky-top">
            <a class="btn btn-block btn-dark">
              <i-tag></i-tag>
              Ver produtos
            </a>
          </section>
          <section class="map">
            <div class="card clean-card">
              <iframe src="${this.store.map}" frameborder="0" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
              <a href="${this.store.directions}" target="_blank" rel="nofollow external noopener noreferrer" class="card-action">
                <i-map></i-map>Como Chegar
              </a>
            </div>
          </section>
          <section class="social">
            <a href="${this.store.fb}" target="_blank" rel="nofollow external noopener noreferrer">
              <i-facebook></i-facebook>
            </a>
            <a href="${this.store.insta}" target="_blank" rel="nofollow external noopener noreferrer">
              <i-instagram></i-instagram>
            </a>
            <a href="${this.store.whatsapp}" target="_blank" rel="nofollow external noopener noreferrer">
              <i-whatsapp></i-whatsapp>
            </a>
          </section>
        </div>
        <nav class="fixed-bottom">
          <div class="nav-item">
            <a class="tab">
              <i-briefcase></i-briefcase>
              Empresa
            </a>
          </div>
          <div class="nav-item">
            <a class="tab">
              <i-tag></i-tag>
              Produtos
            </a>
          </div>
          <div class="nav-item">
            <a class="tab">
              <i-shopping-bag></i-shopping-bag>
              Pedido
            </a>
          </div>
          <div class="nav-item">
            <a class="tab">
              <i-user></i-user>
              Perfil
            </a>
          </div>
        </nav>
      </body>
    </html>`
  }

  setColor(active: string) {
    let color = colors.find(c => c.name == active);
    // tslint:disable-next-line:forin
    for (const key in color.properties) {
      document.getElementById('preview').style.setProperty(key, color.properties[key]);
    }
  }

}
