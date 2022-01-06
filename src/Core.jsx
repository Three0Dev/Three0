import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from './Landing'

export default function Core() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="login" element={<Login />} />
                <Route path="app" element={<PrimaryApp />}>
                </Route> 
            </Routes>
      </BrowserRouter>
    );
}