function PageContentShell({ as: Component = 'div', className = '', children }) {
  const classes = ['container-xxl', 'px-3', 'px-lg-4', 'page-content-shell', className].filter(Boolean).join(' ');

  return <Component className={classes}>{children}</Component>;
}

export default PageContentShell;
