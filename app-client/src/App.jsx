import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getAccountAPI } from './services/auth.service.js'
import { doGetAccountAction } from './redux/account/accountSlice.js'
import {
    createBrowserRouter,
    Navigate,
    Outlet,
    RouterProvider,
} from 'react-router-dom'
import ClientLayout from './layout/client.jsx'
import HomePage from './pages/home/home.jsx'
import AdminLayout from './layout/admin.jsx'
import DashboardPage from './pages/admin/revenue/dashboard.jsx'
import UserPage from './pages/admin/user/user.jsx'
import PermissionPage from './pages/admin/permission/permission.jsx'
import RolePage from './pages/admin/role/role.jsx'
import LoginPage from './pages/login/login.jsx'
import { Flex, Spin } from 'antd'
import LogPage from './pages/admin/log/log.jsx'
import PublisherPage from './pages/admin/publisher/publisher.jsx'
import SupplierPage from './pages/admin/supplier/supplier.jsx'
import CategoryPage from './pages/admin/category/category.jsx'
import BookPage from './pages/admin/book/book.jsx'
import RegisterPage from './pages/register/register.jsx'
import OrderPage from './pages/admin/order/order.jsx'
import BookImportPage from './pages/admin/import/import.jsx'
import ImportCreatePage from './pages/admin/import/create.jsx'
import BookExportPage from './pages/admin/export/export.jsx'
import ImportUpdatePage from './pages/admin/import/update.jsx'
import ExportCreatePage from './pages/admin/export/create.jsx'
import ExportUpdatePage from './pages/admin/export/update.jsx'
import OrderUpdatePage from './pages/admin/order/update.jsx'
import OrderViewPage from './pages/admin/order/view.jsx'
import BookCreatePage from './pages/admin/book/create.jsx'
import BookUpdatePage from './pages/admin/book/update.jsx'
import BookViewPage from './pages/admin/book/view.jsx'
import BookSearchPage from './pages/book/book-search.jsx'
import { getPublishersAPI } from './services/publisher.service.js'
import { getCategoriesAPI } from './services/category.service.js'
import BookDetailPage from './pages/book/book-detail.jsx'
import { getCartAPI } from './services/cart.service.js'
import { doUpdateCartAction } from './redux/cart/cartSlice.js'
import CartPage from './pages/cart/cart.jsx'
import CheckOutPage from './pages/checkout/checkout.jsx'
import PurchasePage from './pages/purchase/purchase.jsx'
import PurchaseDetailPage from './pages/purchase/purchase-detail.jsx'
import CheckoutCallbackPage from './pages/checkout/checkout-callback.jsx'
import AuthCallBack from './pages/auth/call-back.jsx'
import NotFoundPage from './pages/error/not-found.jsx'

const App = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.account.user)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        document.title = 'Book Store'
        getAccount()
        getCart()
        getPublishers()
        getCategories()
    }, [])

    const getAccount = async () => {
        const res = await getAccountAPI()
        setLoading(false)
        if (res && res.data) {
            dispatch(doGetAccountAction(res.data))
        } else {
            console.error(res.message)
        }
    }

    const getCart = async () => {
        const res = await getCartAPI()
        if (res && res.data) {
            dispatch(doUpdateCartAction(res.data))
        } else {
            console.error(res.message)
        }
    }

    const getPublishers = async () => {
        const query = `page=${1}&size=${100}`
        const res = await getPublishersAPI(query)
        if (res && res.data) {
            const filteredData = res.data.data.map((item) => {
                return { label: item.name, value: item.id }
            })
            localStorage.setItem('publishers', JSON.stringify(filteredData))
        } else {
            console.error(res.message)
        }
    }

    const getCategories = async () => {
        const query = `page=${1}&size=${100}`
        const res = await getCategoriesAPI(query)
        if (res && res.data) {
            const filteredData = res.data.data.map((item) => {
                return {
                    label: item.name,
                    value: item.id,
                    image: item.image.url,
                }
            })
            localStorage.setItem('categories', JSON.stringify(filteredData))
        } else {
            console.error(res.message)
        }
    }

    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <ClientLayout>
                    <Outlet />
                </ClientLayout>
            ),
            errorElement: <NotFoundPage />,
            children: [
                { index: true, element: <HomePage /> },
                { path: 'search', element: <BookSearchPage /> },
                { path: 'book', element: <BookDetailPage /> },
                { path: 'cart', element: <CartPage /> },
                {
                    path: 'purchase',
                    element: <Outlet />,
                    children: [
                        { index: true, element: <PurchasePage /> },
                        { path: ':id', element: <PurchaseDetailPage /> },
                    ],
                },
                {
                    path: 'checkout',
                    element: !user.id ? (
                        <Navigate to="/" replace />
                    ) : (
                        <Outlet />
                    ),
                    children: [
                        { index: true, element: <CheckOutPage /> },
                        {
                            path: 'call-back',
                            element: <CheckoutCallbackPage />,
                        },
                    ],
                },
            ],
        },
        {
            path: '/admin',
            element: !user.id ? (
                <Navigate to="/login" replace />
            ) : user.role.name !== 'ADMIN' ? (
                <NotFoundPage />
            ) : (
                <AdminLayout>
                    <Outlet />
                </AdminLayout>
            ),
            errorElement: <NotFoundPage />,
            children: [
                { index: true, element: <DashboardPage /> },
                {
                    element: <Outlet />,
                    children: [
                        { index: true, path: 'user', element: <UserPage /> },
                        { path: 'role', element: <RolePage /> },
                        { path: 'permission', element: <PermissionPage /> },
                        { path: 'log', element: <LogPage /> },
                        { path: 'publisher', element: <PublisherPage /> },
                        { path: 'supplier', element: <SupplierPage /> },
                        { path: 'category', element: <CategoryPage /> },
                        { path: 'import', element: <BookImportPage /> },
                        {
                            path: 'book',
                            element: <Outlet />,
                            children: [
                                { index: true, element: <BookPage /> },
                                { path: 'create', element: <BookCreatePage /> },
                                { path: 'update', element: <BookUpdatePage /> },
                                {
                                    path: ':bookSku',
                                    element: <BookViewPage />,
                                },
                            ],
                        },
                        {
                            path: 'import',
                            element: <Outlet />,
                            children: [
                                { index: true, element: <BookImportPage /> },
                                {
                                    path: 'create',
                                    element: <ImportCreatePage />,
                                },
                                {
                                    path: 'update',
                                    element: <ImportUpdatePage />,
                                },
                            ],
                        },
                        {
                            path: 'export',
                            element: <Outlet />,
                            errorElement: <NotFoundPage />,
                            children: [
                                { index: true, element: <BookExportPage /> },
                                {
                                    path: 'create',
                                    element: <ExportCreatePage />,
                                },
                                {
                                    path: 'update',
                                    element: <ExportUpdatePage />,
                                },
                            ],
                        },
                        {
                            path: 'order',
                            element: <Outlet />,
                            errorElement: <NotFoundPage />,
                            children: [
                                { index: true, element: <OrderPage /> },
                                {
                                    path: 'update',
                                    element: <OrderUpdatePage />,
                                },
                                {
                                    path: ':orderId',
                                    element: <OrderViewPage />,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            path: 'auth/call-back',
            element: <AuthCallBack />,
        },
        {
            path: '/login',
            element: user.id ? <Navigate to="/" replace /> : <LoginPage />,
        },
        {
            path: '/register',
            element: user.id ? <Navigate to="/" replace /> : <RegisterPage />,
        },
    ])

    return (
        <>
            {loading ? (
                <Flex
                    justify="center"
                    align="center"
                    style={{ height: '100vh' }}
                >
                    <Spin size="large" />
                </Flex>
            ) : (
                <>
                    <RouterProvider router={router} />
                </>
            )}
        </>
    )
}

export default App
