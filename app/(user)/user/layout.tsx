import SiteFooter from "@/components/requestsComponents/footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <SiteFooter />

    </div>
  );
};

export default Layout;