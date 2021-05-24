import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Address, Order } from 'src/app/services/entities';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: Order;
  status = ['novo', 'preparando', 'entregando', 'pronto para retirar', 'entregue', 'cancelado'];

  constructor(
    private sService: StoreService,
    private snackbar: SnackbarService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.getOrder();
  }

  private getOrder() {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.setOrder(this.sService.getOrder(params.id));
        if (!this.order) {
          this.notFound();
        }
      } else {
        this.notFound();
      }
    });
  }

  notFound() {
    setTimeout(() => {
      this.back();
    }, 5000);
  }

  back() {
    this.router.navigate([' /pedidos '])
  }

  getMessage(o: Order) {
    let link = `https://api.whatsapp.com/send/?phone=55${o.client.phone}&text=`;
    switch (o.status) {
      case 0:
        link += `🛒 Recebemos o seu pedido, veja os detalhes em: https://${o.store.code}.produtos.app/pedido/${o._id}`
        break;
      case 1:
        link += `🛍 Estamos preparando o seu pedido, veja os detalhes em: https://${o.store.code}.produtos.app/pedido/${o._id}`
        break;
      case 2:
        link += `🛵 O seu pedido saiu para entrega, veja os detalhes em: https://${o.store.code}.produtos.app/pedido/${o._id}`
        break;
      case 3:
        link += `📦 O seu pedido está pronto para retirar, veja os detalhes em: https://${o.store.code}.produtos.app/pedido/${o._id}`
        break;
      case 4:
        link += `✅ O seu pedido foi entregue, veja os detalhes em: https://${o.store.code}.produtos.app/pedido/${o._id}`
        break;
      case 5:
        link += `❌ O seu pedido foi cancelado, veja os detalhes em: https://${o.store.code}.produtos.app/pedido/${o._id}`
        break;
    }
    return link;
  }

  getRoute(ad: Address) {
    return `https://www.google.com.br/maps/dir//${ad.street}, ${ad.number}, ${ad.district}, ${ad.zipCode}, ${ad.city}, ${ad.state}, `
  }

  formatAddress(ad: Address) {
    if (this.order.pickup) {
      return [`Retirar na loja:`, `${ad.name}, ${ad.city} - ${ad.state}`];
    }
    let extra = '';
    if (ad.complement) {
      extra += ', ' + ad.complement
    }
    if (ad.reference) {
      extra += ', Ponto de ref.: ' + ad.reference;
    }
    return [
      'Entregar em:',
      `${ad.name}: ${ad.street}, ${ad.number}${extra}, ${ad.district}, ${ad.city} - ${ad.state}`
    ];
  }

  setStatus(state: string) {
    this.sService.setOrderStatus(this.order._id, this.status.findIndex(p => p == state), this.setOrder);
    document.getElementById('close-modal').click();
  }

  setOrder = (order: Order) => this.order = order;

}
