import React, { useEffect, useState } from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import { FaSearch } from "react-icons/fa";
const Header = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        onScroll();
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return (
        <header className={`site-header hd${scrolled ? ' is-scrolled' : ''}`}>
            <div className='hd-above'>
                <div className="container site-header__container">
                    <Navbar expand="lg" className="site-header__navbar">
                        {/* Logo */}
                        <Navbar.Brand href="/" className="site-header__brand">
                            GiftMaster
                        </Navbar.Brand>
                        {/* Action buttons */}
                        <Nav className="site-header__actions">
                            <Button
                                className="site-header__btn"
                                onClick={() => navigate("/gifts")}
                            >
                                Xem gói quà
                            </Button>
                            <Button
                                className="site-header__btn"
                                onClick={() => navigate("/about")}
                            >
                                Giới thiệu
                            </Button>
                        </Nav>
                        {/* Right side: search, login, language */}
                        <Navbar.Collapse className="site-header__right">
                            <div className="site-header__utilities ms-auto">
                                {/* Search */}
                                <Form inline className="site-header__search">
                                    <div className="input-group">
                                        <Form.Control
                                            type="text"
                                            placeholder="Tìm gói quà"
                                            className="site-header__search-input"
                                        />
                                        <button className="btn site-header__search-btn" type="button">
                                            <FaSearch />
                                        </button>
                                    </div>
                                </Form>
                                {/* Login */}
                                <Nav>
                                    <Nav.Link href="/login" className="site-header__login">
                                        Đăng nhập
                                    </Nav.Link>
                                </Nav>
                                {/* Language dropdown */}
                                <Dropdown className="site-header__lang">
                                    <Dropdown.Toggle variant="success" size="sm">
                                        VN
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#/action-1">ENG</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <button className="btn site-header__btn" onClick={() => setTheme(theme === 'dark' ? 'purple' : 'dark')}>
                                    {theme === 'dark' ? 'Purple' : 'Dark'}
                                </button>
                            </div>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </div>
            <div className='hd-bot'>
                <div className="container">
                    <Navbar.Collapse className="">
                        <Nav>
                            <Nav.Link href="/gifts" className="">
                                Gói Quà
                            </Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link href="/gifts" className="">
                                Danh Mục
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <Navbar.Collapse className="">
                        <Nav>
                            <Nav.Link href="/" className="">
                                Ưu Đãi SV
                            </Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link href="/" className="">
                                Dịch Vụ
                            </Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link href="/about" className="">
                                Giới Thiệu
                            </Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link href="/" className="">
                                Liên Hệ
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </div>
            </div>
        </header>
    )
}

export default Header
