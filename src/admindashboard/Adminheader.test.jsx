import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Adminheader from './Adminheader';
jest.mock('./communications/FloatingCommunications',()=>()=>null);
jest.mock('../components/IsoviaHologram',()=>()=>null);
const initialWidth=window.innerWidth;
beforeEach(()=>{localStorage.setItem('logindetail',JSON.stringify({role:'admin'}));document.body.className='';window.innerWidth=1024;});
afterEach(()=>{localStorage.clear();document.body.className='';window.innerWidth=initialWidth;});
function show(){return render(<MemoryRouter initialEntries={['/admin']}><div className="skin-blue sidebar-mini"><Adminheader/></div></MemoryRouter>);}
test('desktop menu toggles without legacy scripts or hash navigation and cleans up',()=>{
  const view=show();const button=screen.getByRole('button',{name:'Collapse navigation'});expect(button).not.toHaveAttribute('data-toggle');fireEvent.click(button);expect(document.body).toHaveClass('sidebar-collapse');
  expect(screen.getByRole('button',{name:'Expand navigation'})).toHaveAttribute('aria-expanded','false');fireEvent.click(screen.getByRole('button',{name:'Expand navigation'}));expect(document.body).not.toHaveClass('sidebar-collapse');
  fireEvent.click(screen.getByRole('button',{name:'Collapse navigation'}));view.unmount();expect(document.body).not.toHaveClass('sidebar-collapse');
});
test('mobile drawer opens, focuses search, closes on Escape and overlay',()=>{
  window.innerWidth=390;show();fireEvent.click(screen.getByRole('button',{name:'Open navigation'}));expect(document.body).toHaveClass('sidebar-open');expect(screen.getByRole('searchbox',{name:'Find a workspace'})).toHaveFocus();
  expect(document.body.style.overflow).toBe('hidden');
  fireEvent.keyDown(screen.getByRole('searchbox'),{key:'Tab',shiftKey:true});expect(screen.getByRole('link',{name:'Logout'})).toHaveFocus();
  fireEvent.keyDown(screen.getByRole('link',{name:'Logout'}),{key:'Tab'});expect(screen.getByRole('searchbox')).toHaveFocus();
  fireEvent.keyDown(document,{key:'Escape'});expect(document.body).not.toHaveClass('sidebar-open');expect(screen.getByRole('button',{name:'Open navigation'})).toHaveFocus();
  fireEvent.click(screen.getByRole('button',{name:'Open navigation'}));fireEvent.click(screen.getByRole('button',{name:'Close navigation overlay'}));expect(document.body).not.toHaveClass('sidebar-open');
  expect(document.body.style.overflow).not.toBe('hidden');
});
test('mobile selection closes the drawer and resizing preserves desktop preference',()=>{
  const view=show();fireEvent.click(screen.getByRole('button',{name:'Collapse navigation'}));
  act(()=>{window.innerWidth=390;window.dispatchEvent(new Event('resize'));});expect(document.body).not.toHaveClass('sidebar-collapse');
  fireEvent.click(screen.getByRole('button',{name:'Open navigation'}));fireEvent.click(screen.getByRole('button',{name:'Safety & Intelligence'}));fireEvent.click(screen.getByRole('link',{name:'Native ELD Lab'}));expect(document.body).not.toHaveClass('sidebar-open');
  act(()=>{window.innerWidth=1024;window.dispatchEvent(new Event('resize'));});expect(screen.getByRole('button',{name:'Expand navigation'})).toBeVisible();view.unmount();
});
