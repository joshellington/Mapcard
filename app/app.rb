require 'rubygems'
require 'sinatra'
require './config/init'

#
# Before any route is run
before do
  @path = request.env['SCRIPT_NAME']
end

#
# Routes

match '/' do
  erb :index
end

match '/new/?' do
  @id = new_id

  redirect '/'+@id
end

match '/:id/?' do
  @id = params[:id]

  erb :single
end