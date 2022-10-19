import React from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
 
import './../App.css';

export default class AdminComponent extends React.Component {
    state = {
        transactionForm: {},
        barangList: [],
        validated: false,
        totalHarga: 0,
        totalDiskon: 0,
        showNotification: false
    }

    componentDidMount() {
        this.getAllBarang();
    }
    
    getAllBarang() {
        axios.get("http://localhost:3002/barang/>0")
          .then(res => {
            const barangList = res.data;
            this.setState({ barangList });
        })
    }

    countTotalPrice(event, selectedBarang) {
        const { value } = event.target;
        if (value < 0) {
            document.getElementById(selectedBarang.kode).value = 0;
        }

        document.getElementById(`D${selectedBarang.kode}`).disabled = true;
        if (value > 0) {
            document.getElementById(`D${selectedBarang.kode}`).disabled = false;
        }
        if (value > selectedBarang.jumlah) {
            document.getElementById(selectedBarang.kode).value = selectedBarang.jumlah;
        }
        var totalHarga = 0;
        this.state.barangList.map((barang)=> {
            const value = document.getElementById(barang.kode).value;
            totalHarga = totalHarga + (value * barang.harga);
        })
        this.setState({ totalHarga });
    }

    countTotalDiskon(event, selectedBarang) {
        if (event.target.value < 0) {
            document.getElementById(`D${selectedBarang.kode}`).value = 0;
        }
        const jumlahBarangDibeli = document.getElementById(selectedBarang.kode).value;
        const hargaPerBarangDibeli = selectedBarang.harga;
        const hargaBarang = jumlahBarangDibeli * hargaPerBarangDibeli;
        if (event.target.value > hargaBarang) {
            document.getElementById(`D${selectedBarang.kode}`).value = hargaBarang;
        }
        var totalDiskon = 0;
        this.state.barangList.map((barang)=> {
            const value = document.getElementById(`D${barang.kode}`).value;
            totalDiskon = totalDiskon + (value * 1);
        })
        this.setState({ totalDiskon });
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
          event.stopPropagation();
          this.setState({ validated: true });
          return;
        }

        var payload = []
        const { target } = event;
        const kodeTransaksi = moment().format('DDMMYYYYhhmmss') * 1;
        this.state.barangList.map((barang)=> {
            const jumlah = document.getElementById(barang.kode).value * 1;
            if (jumlah > 0) {
                const diskon = document.getElementById(`D${barang.kode}`).value * 1;
                const harga = jumlah * barang.harga;
                const transaksi = { 
                    kodeBarang: barang.kode, 
                    kodeTransaksi,
                    jenisTransaksi: 'Penjualan', 
                    jumlah, 
                    namaPembeli: target.nama_pembeli.value, 
                    namaPenjual: target.nama_admin.value, 
                    harga,
                    diskon
                };
                payload.push(transaksi)
            }
        })
        this.addTransaksi(payload);
    }

    handleReset() {
        this.state.barangList.map((barang)=> {
            document.getElementById(barang.kode).value = '0';
            document.getElementById(`D${barang.kode}`).value = '0';
            document.getElementById(`D${barang.kode}`).disabled = true;
        })
        document.getElementById("nama_admin").value = '';
        document.getElementById("nama_pembeli").value = '';
        document.getElementById("total_harga").value = 'Rp. 0';
        document.getElementById("total_diskon").value = '';
        this.setState({ totalDiskon: 0, totalHarga: 0 });
    }

    addTransaksi(payload) {
        axios.post("http://localhost:3002/transaction", payload)
          .then(res => {
            this.updateStock(payload);
            this.getAllBarang();
            this.setState({ showNotification: true});
            this.handleReset();
        })
    }

    updateStock(payload) {
        payload.map((transaksi) => {
            const {kodeBarang, jumlah} = transaksi;
            axios.put(`http://localhost:3002/barang/${kodeBarang}/-${jumlah}`)
            .then(res => {
                
            })
        })
    }

    render() {
        return(
            <div className="admin">
                <h2>Wanda Collection Admin:</h2>
                <Form noValidate validated={this.state.validated} onSubmit={(event) => this.handleSubmit(event)}>
                <Row>
                    <Col>
                    <Card>
                    <Card.Body>
                    {this.state.barangList.map((barang)=> 
                        <Row key={barang.id}>
                            <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>{barang.nama}</Form.Label>
                                <InputGroup className="mb-3" key={barang.id}>
                                    <InputGroup.Text>@ Rp. {new Intl.NumberFormat(['ban', 'id']).format(barang.harga)}</InputGroup.Text>
                                    <Form.Control id={barang.kode} placeholder='0' onChange={(event) => this.countTotalPrice(event, barang)} type="number"/>
                                </InputGroup>
                            </Form.Group>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Diskon</Form.Label>
                                <InputGroup className="mb-3" key={`D${barang.kode}`}>
                                    <InputGroup.Text>Rp.</InputGroup.Text>
                                    <Form.Control id={`D${barang.kode}`} disabled type="number" onChange={(event) => this.countTotalDiskon(event, barang)} placeholder='0'/>
                                </InputGroup>
                            </Form.Group>
                            </Col>
                        </Row>
                    )}
                    </Card.Body>
                    </Card>
                    </Col>

                    <Col>
                    <Row>
                        <Col>
                        <Form.Group className="mb-3" controlId='nama_admin'>
                        <Form.Label>Nama Admin</Form.Label>
                        <Form.Control type="text" required placeholder="Tulis Nama Admin"/>
                        </Form.Group>
                        </Col>
                        <Col>
                        <Form.Group className="mb-3" controlId='nama_pembeli'>
                        <Form.Label>Nama Pembeli</Form.Label>
                        <Form.Control type="text" required placeholder="Tulis Nama Pembeli"/>
                        </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                        <Form.Group className="mb-3" controlId='total_harga'>
                        <Form.Label>Total Harga</Form.Label>
                        <Form.Control type="text" disabled value={`Rp. ${new Intl.NumberFormat(['ban', 'id']).format(this.state.totalHarga)}`}/>
                        </Form.Group>
                        </Col>

                        <Col>
                        <Form.Group className="mb-3" controlId='total_diskon'>
                        <Form.Label>Total Diskon</Form.Label>
                        <Form.Control type="text" disabled value={`Rp. ${new Intl.NumberFormat(['ban', 'id']).format(this.state.totalDiskon)}`}/>
                        </Form.Group>
                        </Col>
                    </Row>

                    <div>Total Bayar</div>
                    <h5>Rp. {new Intl.NumberFormat(['ban', 'id']).format(this.state.totalHarga - this.state.totalDiskon)}</h5>
                    <br/>

                    <ButtonGroup style={{width: '100%'}} className="mb-2">
                        <Button type="submit">Bayar</Button>
                        <Button variant="secondary" onClick={() => this.handleReset()}>Hapus</Button>
                    </ButtonGroup>
                    </Col>
                    </Row>
                </Form>

                <Modal
                show={this.state.showNotification}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <h4>Success!!!</h4>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.setState({ showNotification: false})}>Close</Button>
                </Modal.Footer>
                </Modal>
            </div>
        )
    }
}